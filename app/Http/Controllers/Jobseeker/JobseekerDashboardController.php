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

        $careerInterest?->jobTitles->pluck('opening_title_id')->toArray() ?? [];
        $careerInterest?->industries->pluck('industry_id')->toArray() ?? [];
        $careerInterest?->locations->pluck('location_id')->toArray() ?? [];
        $careerInterest?->employmentTypes->pluck('employment_type')->toArray() ?? [];

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

        // if (!empty($employmentTypes)) {
        //     $jobsQuery->whereIn('employment_type', $employmentTypes);
        // }

        $jobs = $jobsQuery->latest()
            ->with('company')
            ->get();

        return Inertia::render('jobseeker/explore', [
            'openings' => $jobs,
            'interests' => [
                'categories' => $careerInterest?->industries()->pluck('name')->toArray() ?? [],
                'locations' => $careerInterest?->locations()->pluck('city')->toArray() ?? [],
            ],
        ]);
    }
}
