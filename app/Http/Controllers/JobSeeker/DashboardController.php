<?php

declare(strict_types=1);

namespace App\Http\Controllers\JobSeeker;

use App\Http\Controllers\Controller;
use App\Models\JobPosting;
use App\Traits\JobHelpers;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

final class DashboardController extends Controller
{
    use JobHelpers;

    public function index(): Response
    {
        $jobs = JobPosting::with('company')->latest()->get();

        $jobseeker = Auth::user()->jobseeker;
        $jobs = $this->addSaveStatusToJobs($jobs, $jobseeker);

        return Inertia::render('jobseeker/explore', [
            'jobs' => $jobs,
        ]);
    }

    public function savedJobsList(): Response
    {
        $jobseeker = Auth::user()->jobseeker;

        $jobs = $jobseeker->savedJobPostings;

        $jobs = $this->addSaveStatusToJobs($jobs, $jobseeker);

        return Inertia::render('jobseeker/jobs/saved-jobs-listing', [
            'jobs' => $jobs->load('company'),
        ]);
    }

    public function appliedJobsList(): Response
    {
        $jobseeker = Auth::user()->jobseeker;

        $jobs = $jobseeker->appliedJobs;

        return Inertia::render('jobseeker/jobs/applied-jobs-listing', [
            'jobs' => $jobs->load('company'),
        ]);
    }
}
