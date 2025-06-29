<?php

namespace App\Http\Controllers\Admin;

use App\Enums\VerificationStatusEnum;
use App\Http\Controllers\Controller;
use App\Mail\Employer\VerificationUpdateMail;
use App\Models\Company;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Inertia\Response;

class EmployerVerifyController extends Controller
{
    public function verify(Request $request): Response
    {
        $user = User::find($request->employer);
        $company = Company::find($request->company);
        $profile = $user->profile;
        $companyUser = $company->companyUsers()->where('user_id', $user->id)->first();

        return Inertia::render('admin/employers/verify', [
            'user' => $user,
            'profile' => $profile,
            'company' => $company,
            'company_user' => $companyUser
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'user_id' => 'required|int',
            'company_id' => 'required|int',
            'status' => 'required|string',
            'verification_status' => 'required|string',
        ]);

        $user = User::find($data['user_id']);
        $company = Company::find($data['company_id']);
        $company->verification_status = $data['verification_status'];
        $company->save();

        $companyUser = $company->companyUsers()->where('user_id', $user->id)->first();
        $companyUser->verification_status = $data['status'];
        if ($companyUser->verification_status === VerificationStatusEnum::Verified->value) {
            $companyUser->verified_at = now();
        }
        $reason = $request->rejection_reason;

        Mail::to($user)->send(new VerificationUpdateMail($user, $company, $reason));

        $companyUser->save();

        return back()->with('success', 'Verification status updated successfully');
    }
}
