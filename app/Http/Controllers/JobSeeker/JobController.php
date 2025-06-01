<?php

namespace App\Http\Controllers\JobSeeker;

use App\Http\Controllers\Controller;
use App\Models\JobPosting;
use App\Traits\HasJobSaveStatus;
use App\Traits\Traits\JobSaveStatus;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

use function Termwind\render;

class JobController extends Controller
{
    use JobSaveStatus;

    public function show(string $jobId): Response
    {
        $job = JobPosting::with(['company', 'skills'])->find($jobId);

        $jobseeker = Auth::user()?->jobseeker;

        $job = $this->addSaveStatusToJob($job, $jobseeker);

        return Inertia::render('jobseeker/jobs/job-details', [
            'job' => $job
        ]);
    }
}
