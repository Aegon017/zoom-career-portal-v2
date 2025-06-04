<?php

namespace App\Http\Controllers;

use App\Models\JobTitle;
use App\Models\TalentProfile;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class EmployerOnBoardingController extends Controller
{
    public function profileSetup()
    {
        $user = Auth::user();
        $talent_profiles = TalentProfile::query()->get();
        $job_titles = JobTitle::query()->get();

        return Inertia::render('employer/on-boarding/profile-setup', [
            'user' => $user,
            'talent_profiles' => $talent_profiles,
            'job_titles' => $job_titles
        ]);
    }
}
