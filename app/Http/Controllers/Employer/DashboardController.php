<?php

declare(strict_types=1);

namespace App\Http\Controllers\Employer;

use App\Enums\JobApplicationStatusEnum;
use App\Enums\JobStatusEnum;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

final class DashboardController extends Controller
{
    public function index(): Response
    {
        $user = Auth::user();
        $noOfJobs = $user->openings()->count();
        $noOfPublishedJobs = $user->openings()->where('status', JobStatusEnum::Published->value)->count();
        $noOfClosedJobs = $user->openings()->where('status', JobStatusEnum::Closed->value)->count();
        $noOfDraftJobs = $user->openings()->where('status', JobStatusEnum::Draft->value)->count();
        $noOfApplications = $user->openingApplicationsReceived()->count();
        $noOfShortlisted = $user->openingApplicationsReceived()->where('opening_applications.status', JobApplicationStatusEnum::Shortlisted->value)->count();
        $noOfHired = $user->openingApplicationsReceived()->where('opening_applications.status', JobApplicationStatusEnum::Hired->value)->count();

        return Inertia::render('employer/dashboard', [
            'noOfJobs' => $noOfJobs,
            'noOfPublishedJobs' => $noOfPublishedJobs,
            'noOfClosedJobs' => $noOfClosedJobs,
            'noOfDraftJobs' => $noOfDraftJobs,
            'noOfApplications' => $noOfApplications,
            'noOfShortlisted' => $noOfShortlisted,
            'noOfHired' => $noOfHired,
        ]);
    }
}
