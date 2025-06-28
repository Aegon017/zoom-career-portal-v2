<?php

namespace App\Http\Controllers\Employer;

use App\Enums\CompanySizeEnum;
use App\Enums\CompanyTypeEnum;
use App\Enums\EmployerOnBoardingEnum;
use App\Enums\VerificationStatusEnum;
use App\Http\Controllers\Controller;
use App\Mail\Admin\EmployerRegisteredMail as AdminEmployerRegisteredMail;
use App\Mail\EmployerRegisteredMail;
use App\Models\Company;
use App\Models\Industry;
use App\Models\Location;
use App\Models\OpeningTitle;
use App\Models\Profile;
use App\Models\User;
use App\Notifications\EmployerVerifyNotification;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class OnboardingController extends Controller
{
    public function setupProfile(): Response
    {
        $user = Auth::user();
        $job_titles = OpeningTitle::orderBy('name')->get();

        return Inertia::render('employer/on-boarding/profile-setup', [
            'user' => $user,
            'job_titles' => $job_titles,
        ]);
    }

    public function storeProfile(Request $request): RedirectResponse
    {
        $user = Auth::user();

        $data = $request->validate([
            'avatar' => 'nullable|string',
            'job_title' => 'required|string|max:255',
            'phone' => 'required|string|unique:users,phone|max:16',
        ]);

        $user->phone = $data['phone'];
        $user->save();

        $user->profile()->create([
            'job_title' => $data['job_title']
        ]);

        if (! empty($data['avatar']) && Storage::disk('public')->exists($data['avatar'])) {
            $user->addMedia(storage_path('app/public/' . $data['avatar']))
                ->preservingOriginal()
                ->toMediaCollection('avatars');
        }

        $user->employerOnBording()->update([
            'step' => EmployerOnBoardingEnum::COMPANY_CREATE_OR_JOIN->value,
            'is_completed' => false,
        ]);

        return to_route('employer.on-boarding.company.create-or-join');
    }

    public function companyCreateOrJoin(): Response
    {
        $companies = Company::orderBy('name')->get();

        return Inertia::render('employer/on-boarding/company-create-or-join', [
            'companies' => $companies,
        ]);
    }

    public function handleCompanyCreateOrJoin(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'company' => 'required',
            'is_new' => 'required|boolean'
        ]);

        $user = Auth::user();

        if ($data['is_new']) {
            $name = $data['company'];

            $user->employerOnBording()->update([
                'step' => EmployerOnBoardingEnum::COMPANY_SETUP->value,
                'is_completed' => false,
            ]);

            return to_route('employer.on-boarding.setup.company', [
                'name' => $name,
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
        $industries = Industry::get()->map(function ($industry) {
            return [
                'value' => $industry->id,
                'label' => $industry->name,
            ];
        });
        $locations = Location::get()->map(function ($location) {
            return [
                'value' => $location->id,
                'label' => $location->full_name,
            ];
        });

        return Inertia::render('employer/on-boarding/company-setup', [
            'name' => $request->name,
            'industries' => $industries,
            'locations' => $locations,
            'sizes' => CompanySizeEnum::options(),
            'types' => CompanyTypeEnum::options(),
        ]);
    }

    public function storeCompany(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'logo_url' => 'nullable|string',
            'industry_id' => 'required|integer|exists:industries,id',
            'website_url' => 'required|url|max:255',
            'description' => 'required|string|max:1000',
            'location_id' => 'required|integer|exists:locations,id',
            'size' => 'required|string|max:50',
            'type' => 'required|string|max:50',
        ]);

        $company = Company::create([
            'name' => $data['name'],
            'industry_id' => $data['industry_id'],
            'website_url' => $data['website_url'],
            'description' => $data['description'],
            'size' => $data['size'],
            'type' => $data['type'],
            'verification_status' => VerificationStatusEnum::Pending->value
        ]);

        $user = Auth::user();

        $company->address()->create([
            'location_id' => $data['location_id']
        ]);

        if (! empty($data['logo_url']) && Storage::disk('public')->exists($data['logo_url'])) {
            $company->addMedia(storage_path('app/public/' . $data['logo_url']))
                ->preservingOriginal()
                ->toMediaCollection('logos');
        }

        $company->users()->attach($user->id, ['role' => 'recruiter', 'verified_at' => null, 'verification_status' => VerificationStatusEnum::Pending->value]);

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

        $name = $user->name;
        $company_name = $company->name;
        $review_link = route('admin.employer.verify', [
            'employer' => $user->id,
            'company' => $company->id,
        ]);

        Mail::to($user)->send(new EmployerRegisteredMail($name, $company_name));

        foreach ($admins as $admin) {
            Mail::to($admin)->send(new AdminEmployerRegisteredMail($name, $company_name, $review_link));
        }

        Notification::send($admins, new EmployerVerifyNotification($user, $company));
    }
}
