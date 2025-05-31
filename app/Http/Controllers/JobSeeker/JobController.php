<?php

namespace App\Http\Controllers\JobSeeker;

use App\Http\Controllers\Controller;
use App\Models\JobPosting;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

use function Termwind\render;

class JobController extends Controller
{
    public function show(string $jobId): Response
    {
        $job = JobPosting::with(['company', 'skills'])->find($jobId);

        return Inertia::render('jobseeker/jobs/job-details', [
            'job' => $job
        ]);
    }
}
