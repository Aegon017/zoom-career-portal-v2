<?php

declare(strict_types=1);

namespace App\Http\Controllers\Employer;

use App\Actions\CreateCompanyAction;
use App\Actions\CreateEmployerProfileAction;
use App\Enums\CompanySizeEnum;
use App\Enums\CompanyTypeEnum;
use App\Enums\EmployerOnBoardingEnum;
use App\Enums\VerificationStatusEnum;
use App\Http\Controllers\Controller;
use App\Models\Company;
use App\Models\OpeningTitle;
use App\Models\TalentProfile;
use App\Models\User;
use App\Notifications\EmployerVerifyNotification;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

final class EmployerOnBoardingController extends Controller
{
    public function __construct(
        private CreateEmployerProfileAction $createEmployerProfileAction,
        private CreateCompanyAction $createCompanyAction
    ) {}

    public function setupProfile(): Response
    {
        $user = Auth::user();
        $talent_profiles = TalentProfile::query()->get();
        $job_titles = OpeningTitle::query()->get();

        return Inertia::render('employer/on-boarding/profile-setup', [
            'user' => $user,
            'talent_profiles' => $talent_profiles,
            'job_titles' => $job_titles,
        ]);
    }

    public function storeProfile(Request $request): RedirectResponse
    {
        $user = Auth::user();

        $data = $request->validate([
            'profile_image' => 'nullable|string',
            'job_title_id' => 'required|exists:opening_titles,id',
            'types_of_candidates' => 'nullable|array',
            'phone' => 'required|string|max:20',
        ]);

        $user->phone = $data['phone'];
        $user->save();

        $employerProfile = $this->createEmployerProfileAction->handle($data, $user);

        $employerProfile->talentProfiles()->attach(array_values($data['types_of_candidates']));

        if (! empty($data['profile_image']) && Storage::disk('public')->exists($data['profile_image'])) {
            $user->addMedia(storage_path('app/public/'.$data['profile_image']))
                ->preservingOriginal()
                ->toMediaCollection('profile_images');
        }

        $user->employerOnBording()->update([
            'step' => EmployerOnBoardingEnum::COMPANY_CREATE_OR_JOIN->value,
            'is_completed' => false,
        ]);

        return to_route('employer.on-boarding.company.create-or-join');
    }

    public function companyCreateOrJoin(): Response
    {
        $companies = Company::query()->orderBy('company_name')->get();

        $user = Auth::user();

        return Inertia::render('employer/on-boarding/company-create-or-join', [
            'companies' => $companies,
        ]);
    }

    public function handleCompanyCreateOrJoin(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'company' => 'required',
            'is_new' => 'required|boolean',
        ]);

        $user = Auth::user();

        if ($data['is_new']) {
            $company_name = $data['company'];

            $user->employerOnBording()->update([
                'step' => EmployerOnBoardingEnum::COMPANY_SETUP->value,
                'is_completed' => false,
            ]);

            return to_route('employer.on-boarding.setup.company', [
                'company_name' => $company_name,
            ]);
        }

        $company = Company::find($data['company']);

        $company->users()->attach($user->id, ['role' => 'recruiter', 'verified_at' => null, 'status' => VerificationStatusEnum::Pending->value]);

        $user->employerOnBording()->update([
            'step' => EmployerOnBoardingEnum::COMPANY_JOIN_VERIFICATION->value,
            'is_completed' => true,
        ]);

        $this->sendNotification($user, $company);

        return to_route('employer.on-boarding.company.join.verification.pending');
    }

    public function setupCompany(Request $request): Response|RedirectResponse
    {
        return Inertia::render('employer/on-boarding/company-setup', [
            'company_name' => $request->company_name,
            'company_sizes' => CompanySizeEnum::options(),
            'company_types' => CompanyTypeEnum::options(),
        ]);
    }

    public function storeCompany(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'company_name' => 'required|string|max:255',
            'company_logo' => 'nullable|string',
            'industry' => 'required|string|max:100',
            'company_website' => 'required|url|max:255',
            'company_description' => 'required|string|max:1000',
            'company_address' => 'required|string|max:255',
            'public_phone' => 'nullable|string|max:20',
            'public_email' => 'nullable|email|max:255',
            'company_size' => 'required|string|max:50',
            'company_type' => 'required|string|max:50',
        ]);

        $verification_status = VerificationStatusEnum::Pending->value;

        $user = Auth::user();

        $company = $this->createCompanyAction->handle($data, $verification_status);

        if (! empty($data['company_logo']) && Storage::disk('public')->exists($data['company_logo'])) {
            $company->addMedia(storage_path('app/public/'.$data['company_logo']))
                ->preservingOriginal()
                ->toMediaCollection('company_logos');
        }

        $company->users()->attach($user->id, ['role' => 'recruiter', 'verified_at' => null, 'status' => VerificationStatusEnum::Pending->value]);

        $user->employerOnBording()->update([
            'step' => EmployerOnBoardingEnum::COMPANY_SETUP_VERIFICATION->value,
            'is_completed' => true,
        ]);

        $this->sendNotification($user, $company);

        return to_route('employer.on-boarding.setup.company.verification.pending');
    }

    public function joinVerificationPending(): Response
    {
        $company = Auth::user()?->companies()->latest()->first();

        return Inertia::render('employer/on-boarding/join-company-verification-pending', [
            'company' => $company,
        ]);
    }

    public function setupVerificationPending(): Response
    {
        return Inertia::render('employer/on-boarding/setup-company-verification-pending');
    }

    public function sendNotification(User $user, Company $company): void
    {
        $admins = User::role('super_admin')->get();

        Notification::send($admins, new EmployerVerifyNotification($user, $company));
    }
}
