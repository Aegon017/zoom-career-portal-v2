<?php

namespace App\Traits\Traits;

use App\Models\JobPosting;
use App\Models\Jobseeker;

trait JobSaveStatus
{
    /**
     * Add `is_saved` field to a single JobPosting.
     */
    protected function addSaveStatusToJob(JobPosting $job, ?Jobseeker $jobseeker): JobPosting
    {
        $job->is_saved = $jobseeker
            ? $jobseeker->savedJobPostings()->where('job_posting_id', $job->id)->exists()
            : false;

        return $job;
    }

    /**
     * Add `is_saved` field to a collection of jobs.
     */
    protected function addSaveStatusToJobs($jobs, ?Jobseeker $jobseeker)
    {
        $savedIds = $jobseeker
            ? $jobseeker->savedJobPostings()->pluck('job_posting_id')->toArray()
            : [];

        return $jobs->map(function ($job) use ($savedIds) {
            $job->is_saved = in_array($job->id, $savedIds);
            return $job;
        });
    }
}
