<?php

declare(strict_types=1);

namespace App\Http\Controllers\Jobseeker;

use App\Enums\VerificationStatusEnum;
use App\Http\Controllers\Controller;
use App\Models\Industry;
use App\Models\Location;
use App\Models\Opening;
use App\Models\OpeningTitle;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

final class JobseekerDashboardController extends Controller
{
    // JobseekerDashboardController.php
    // JobseekerDashboardController.php
    public function index(): Response
    {
        $user = Auth::user();

        $careerInterest = $user->careerInterest()
            ->with(['jobTitles', 'industries', 'locations', 'employmentTypes'])
            ->first();

        if (!$careerInterest) {
            return Inertia::render('jobseeker/explore', [
                'openings' => [],
                'interests' => [
                    'categories' => [],
                    'locations' => [],
                ],
            ]);
        }

        // Get user's interest data
        $jobTitleIds = $careerInterest->jobTitles->pluck('opening_title_id')->toArray();
        $industryIds = $careerInterest->industries->pluck('industry_id')->toArray();
        $locationIds = $careerInterest->locations->pluck('location_id')->toArray();
        $employmentTypes = $careerInterest->employmentTypes
            ->map(fn($type) => $type->employment_type->value)
            ->toArray();

        $jobTitles = OpeningTitle::whereIn('id', $jobTitleIds)->pluck('name')->toArray();
        $industryNames = Industry::whereIn('id', $industryIds)->pluck('name')->toArray();

        // Get all openings that match user's interests
        $jobs = Opening::where('verification_status', VerificationStatusEnum::Verified->value)
            ->where('expires_at', '>', now())
            ->where(function ($query) use ($jobTitles, $industryIds, $employmentTypes) {
                // Job titles condition
                if (!empty($jobTitles)) {
                    $query->whereIn('title', $jobTitles);
                }

                // Industry condition
                if (!empty($industryIds)) {
                    $query->orWhereHas('company', function ($q) use ($industryIds) {
                        $q->whereHas('industry', function ($q) use ($industryIds) {
                            $q->whereIn('id', $industryIds);
                        });
                    });
                }

                // Employment type condition
                if (!empty($employmentTypes)) {
                    $query->orWhereIn('employment_type', $employmentTypes);
                }

                // Location condition
                if (!empty($locationNames)) {
                    $query->where(function ($q) use ($locationNames) {
                        foreach ($locationNames as $location) {
                            $q->orWhere('city', 'like', "%$location%");
                        }
                    });
                }
            })
            ->with(['company', 'company.industry'])
            ->latest()
            ->take(6)
            ->get();

        // Prepare interests for the View More link
        $viewMoreFilters = [
            'job_title' => count($jobTitles) > 0 ? $jobTitles[0] : '',
            'industries' => $industryIds,
        ];

        if (!$careerInterest) {
            return Inertia::render('jobseeker/explore', [
                'openings' => [],
                'interests' => [
                    'categories' => [],
                    'locations' => [],
                    'viewMoreFilters' => [
                        'job_title' => '',
                        'industries' => [],
                    ],
                ],
            ]);
        }


        return Inertia::render('jobseeker/explore', [
            'openings' => $jobs,
            'interests' => [
                'categories' => array_unique(array_merge($jobTitles, $industryNames)),
                'viewMoreFilters' => $viewMoreFilters,
            ],
        ]);
    }
}
