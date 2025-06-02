<?php

namespace App\Http\Controllers\Employer;

use App\Enums\VerificationStatusEnum;
use App\Http\Controllers\Controller;
use App\Models\Company;
use App\Models\Employer;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;

class RegisterController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('auth/employer-register');
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:' . User::class,
            'password' => ['required', 'confirmed', Password::defaults()],
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password)
        ]);

        event(new Registered($user));

        Auth::login($user);

        return to_route('employer.user-profile.create');
    }

    public function profileCreate(): Response
    {
        return Inertia::render('auth/employer-profile-create');
    }

    public function profileStore(Request $request): RedirectResponse
    {

        $data = $request->validate([
            'profile_image' => 'nullable|string',
            'job_title' => 'required|string',
            'types_of_candidates' => 'required|array',
            'phone' => 'required|string',
        ]);

        $data['verification_status'] = VerificationStatusEnum::Pending->value;

        Auth::user()->employer()->create($data);

        return to_route('employer.join.company');
    }

    public function joinCompany(): Response
    {
        $companies = Company::orderBy('company_name', 'asc')->get();
        return Inertia::render('auth/create-or-join-company', [
            'companies' => $companies
        ]);
    }

    public function joinCompanyPending(Company $company): Response
    {
        return Inertia::render('auth/join-company-request-pending', [
            'company' => $company
        ]);
    }

    public function companyVerify(Request $request)
    {
        $data =   $request->validate([
            'company' => 'required|string',
            'isNewCompany' => 'nullable|boolean'
        ]);

        [$company, $isNewCompany] = array_values($data);

        if ($isNewCompany) {
            return to_route('company.register', [
                'company' => $company
            ]);
        }

        return to_route('employer.join.company.pending', $company);
    }
}
