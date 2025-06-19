<?php

declare(strict_types=1);

namespace App\Traits;

use App\Models\Opening;
use App\Models\OpeningApplication;
use App\Models\User;

trait JobHelpers
{
    public function addSaveStatusToJobs($jobs, $user)
    {
        $savedIds = $user
            ? $user->savedOpenings()->pluck('opening_id')->toArray()
            : [];

        foreach ($jobs as $job) {
            $job->is_saved = in_array($job->id, $savedIds);
        }

        return $jobs;
    }

    public function addApplicationStatusToJob($job, $user)
    {
        $applications = $user
            ? OpeningApplication::where('user_id', $user->id)->get()->keyBy('opening_id')
            : collect();

        $application = $applications->get($job->id);
        $job->has_applied = ! is_null($application);
        $job->application_status = $application?->status;
        $job->application_created_at = $application?->created_at;

        return $job;
    }

    public function addApplicationStatusToJobs($jobs, $user)
    {
        $applications = $user
            ? OpeningApplication::where('user_id', $user->id)->get()->keyBy('opening_id')
            : collect();

        foreach ($jobs as $job) {
            $application = $applications->get($job->id);
            $job->has_applied = ! is_null($application);
            $job->application_status = $application?->status;
            $job->application_created_at = $application?->created_at;
        }

        return $jobs;
    }

    protected function addSaveStatusToJob(Opening $job, ?User $user): Opening
    {
        $job->is_saved = $user && $user->savedOpenings()->where('opening_id', $job->id)->exists();

        return $job;
    }
}
