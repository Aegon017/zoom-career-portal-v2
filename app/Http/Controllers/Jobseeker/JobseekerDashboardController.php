<?php

declare(strict_types=1);

namespace App\Http\Controllers\Jobseeker;

use App\Enums\VerificationStatusEnum;
use App\Http\Controllers\Controller;
use App\Models\Opening;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

final class JobseekerDashboardController extends Controller
{
    public function index(): Response
    {
        $user = Auth::user();

        $careerInterest = $user->careerInterest()
            ->with(['jobTitles', 'industries', 'locations', 'employmentTypes'])
            ->first();

        $jobTitleIds =  $careerInterest?->jobTitles->pluck('opening_title_id')->toArray() ?? [];
        $industryIds = $careerInterest?->industries->pluck('industry_id')->toArray() ?? [];
        $locationIds = $careerInterest?->locations->pluck('location_id')->toArray() ?? [];
        $employmentTypes = $careerInterest?->employmentTypes->pluck('employment_type')->toArray() ?? [];

        $jobsQuery = Opening::where('verification_status', VerificationStatusEnum::Verified->value)
            ->where('expires_at', '>', now());

        // if (!empty($jobTitleIds)) {
        //     $jobsQuery->whereIn('opening_title_id', $jobTitleIds);
        // }

        // if (!empty($industryIds)) {
        //     $jobsQuery->whereIn('industry_id', $industryIds);
        // }

        // if (!empty($locationIds)) {
        //     $jobsQuery->whereIn('location_id', $locationIds);
        // }

        if (!empty($employmentTypes)) {
            $jobsQuery->whereIn('employment_type', $employmentTypes);
        }

        $jobs = $jobsQuery->latest()
            ->with('company')
            ->get();

        $industries = $careerInterest?->industries()->with('industry')->get() ?? collect();

        $locations = $careerInterest?->locations()->with('location')->get() ?? collect();

        $employmentTypes = $careerInterest?->employmentTypes->pluck('employment_type')->toArray() ?? [];

        return Inertia::render('jobseeker/explore', [
            'openings' => $jobs,
            'interests' => [
                'categories' => $employmentTypes ?? [],
                'locations' => $locations->pluck('location.city')->toArray() ?? [],
            ],
        ]);
    }
}
