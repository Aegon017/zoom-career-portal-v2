<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminEmployerVerifyController extends Controller
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
            'pivot' => $pivotData
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
        $pivotData->save();
        return back()->with('success', 'Verification status updated successfully');
    }
}
