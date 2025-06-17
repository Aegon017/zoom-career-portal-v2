<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Enums\VerificationStatusEnum;
use App\Mail\Employer\VerificationUpdateMail;
use App\Models\Company;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

final class AdminEmployerVerifyController extends Controller
{
    public function verify(Request $request)
    {
        $user = User::find($request->employer);
        $company = Company::find($request->company);
        $employer_profile = $user->employerProfile->load(['openingTitle', 'talentProfiles']);
        $pivotData = $user->companies->first()?->pivot;

        return Inertia::render('admin/employers/verify', [
            'user' => $user,
            'employer_profile' => $employer_profile,
            'company' => $company,
            'pivot' => $pivotData,
        ]);
    }

    public function store(Request $request)
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
        $pivotData = $user->companies->first()?->pivot;
        $pivotData->status = $data['status'];
        if ($pivotData->status === VerificationStatusEnum::Verified->value) {
            $pivotData->verified_at = now();
            Mail::to($user)->send(new VerificationUpdateMail($user, $company));
        }
        $pivotData->save();

        return back()->with('success', 'Verification status updated successfully');
    }
}
