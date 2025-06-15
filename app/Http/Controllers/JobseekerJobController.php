<?php

namespace App\Http\Controllers;

use App\Enums\VerificationStatusEnum;
use App\Models\Opening;
use App\Traits\JobHelpers;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class JobseekerJobController extends Controller
{
    use JobHelpers;

    public function show(string $jobId): Response
    {
        $job = Opening::with(['company', 'skills'])->find($jobId);

        $user = Auth::user();

        $job = $this->addSaveStatusToJob($job, $user);
        $job = $this->addApplicationStatusToJob($job, $user);

        $similar_jobs = Opening::where('title', 'LIKE', '%' . $job->title . '%')
            ->where('id', '!=', $job->id)
            ->where('verification_status', VerificationStatusEnum::Approved->value)
            ->where('expires_at', '>', now())
            ->with('company')
            ->latest()
            ->get();

        return Inertia::render('jobseeker/jobs/job-details', [
            'job' => $job,
            'similar_jobs' => $similar_jobs
        ]);
    }
}
