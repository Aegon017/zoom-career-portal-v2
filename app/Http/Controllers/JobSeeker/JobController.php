<?php

namespace App\Http\Controllers\JobSeeker;

use App\Http\Controllers\Controller;
use App\Models\JobApplication;
use App\Models\JobPosting;
use App\Traits\JobHelpers;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class JobController extends Controller
{
    use JobHelpers;

    public function show(string $jobId): Response
    {
        $job = JobPosting::with(['company', 'skills', 'applications'])->find($jobId);

        $jobseeker = Auth::user()?->jobseeker;

        $job = $this->addSaveStatusToJob($job, $jobseeker);
        $job = $this->addApplicationStatusToJob($job, $jobseeker);

        return Inertia::render('jobseeker/jobs/job-details', [
            'job' => $job
        ]);
    }

    public function apply(JobPosting $jobPosting)
    {
        $jobseeker = Auth::user()?->jobseeker;

        JobApplication::firstOrCreate(
            [
                'jobseeker_id' => $jobseeker->id,
                'job_posting_id' => $jobPosting->id,
            ],
            [
                'status' => 'applied',
            ]
        );

        return back()->with('success', 'You have applied to this job.');
    }

    public function withdraw(JobPosting $jobPosting)
    {
        $jobseeker = Auth::user()?->jobseeker;

        JobApplication::where('jobseeker_id', $jobseeker->id)
            ->where('job_posting_id', $jobPosting->id)
            ->delete();

        return back()->with('success', 'You have withdrawn your application.');
    }
}
