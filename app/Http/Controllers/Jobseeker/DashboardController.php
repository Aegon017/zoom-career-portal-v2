<?php

declare(strict_types=1);

namespace App\Http\Controllers\Jobseeker;

use App\Enums\JobApplicationStatusEnum;
use App\Enums\JobStatusEnum;
use App\Enums\VerificationStatusEnum;
use App\Http\Controllers\Controller;
use App\Models\Industry;
use App\Models\Opening;
use App\Models\OpeningTitle;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

final class DashboardController extends Controller
{
    public function index(): Response
    {
        $user = Auth::user();
        $noOfJobs = Opening::where('status', JobStatusEnum::Published->value)->count();
        $noOfAppliedJobs = $user->openingApplications()
            ->where('status', JobApplicationStatusEnum::Applied->value)
            ->count();
        $noOfSavedJobs = $user->savedOpenings()->count();
        $noOfShortlistedJobs = $user->openingApplications()
            ->where('status', JobApplicationStatusEnum::Shortlisted->value)
            ->count();
        $noOfHiredJobs = $user->openingApplications()
            ->where('status', JobApplicationStatusEnum::Hired->value)
            ->count();

        return Inertia::render('jobseeker/dashboard', [
            'noOfJobs' => $noOfJobs,
            'noOfAppliedJobs' => $noOfAppliedJobs,
            'noOfSavedJobs' => $noOfSavedJobs,
            'noOfShortlistedJobs' => $noOfShortlistedJobs,
            'noOfHiredJobs' => $noOfHiredJobs,
        ]);
    }
}
