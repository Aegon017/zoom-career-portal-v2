<?php

namespace App\Http\Controllers\JobSeeker;

use App\Http\Controllers\Controller;
use App\Models\JobPosting;
use App\Traits\Traits\JobSaveStatus;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    use JobSaveStatus;

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
            'jobs' => $jobs->load('company')
        ]);
    }
}
