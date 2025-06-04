<?php

declare(strict_types=1);

namespace App\Traits;

use App\Models\JobApplication;
use App\Models\JobPosting;
use App\Models\Jobseeker;

trait JobHelpers
{
    public function addSaveStatusToJobs($jobs, $jobseeker)
    {
        $savedIds = $jobseeker
            ? $jobseeker->savedJobPostings()->pluck('job_posting_id')->toArray()
            : [];

        foreach ($jobs as $job) {
            $job->is_saved = in_array($job->id, $savedIds);
        }

        return $jobs;
    }

    public function addApplicationStatusToJob($job, $jobseeker)
    {
        $applications = $jobseeker
            ? JobApplication::where('jobseeker_id', $jobseeker->id)->get()->keyBy('job_posting_id')
            : collect();

        $application = $applications->get($job->id);
        $job->has_applied = ! is_null($application);
        $job->application_status = $application?->status;

        return $job;
    }

    public function addApplicationStatusToJobs($jobs, $jobseeker)
    {
        $applications = $jobseeker
            ? JobApplication::where('jobseeker_id', $jobseeker->id)->get()->keyBy('job_posting_id')
            : collect();

        foreach ($jobs as $job) {
            $application = $applications->get($job->id);
            $job->has_applied = ! is_null($application);
            $job->application_status = $application?->status;
        }

        return $jobs;
    }

    protected function addSaveStatusToJob(JobPosting $job, ?Jobseeker $jobseeker): JobPosting
    {
        $job->is_saved = $jobseeker
            ? $jobseeker->savedJobPostings()->where('job_posting_id', $job->id)->exists()
            : false;

        return $job;
    }
}
