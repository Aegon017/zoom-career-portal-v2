<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Enums\VerificationStatusEnum;
use App\Models\Opening;
use App\Traits\JobHelpers;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

final class JobseekerJobController extends Controller
{
    use JobHelpers;

    public function index(Request $request): Response
    {
        $query = Opening::query()
            ->where('verification_status', VerificationStatusEnum::Verified->value)
            ->where('expires_at', '>', now())
            ->with('company');

        if ($request->filled('company')) {
            $query->whereHas(
                'company',
                fn ($q) => $q->where('company_name', 'like', '%'.$request->company.'%')
            );
        }

        if ($request->filled('job_title')) {
            $query->where('title', 'like', '%'.$request->job_title.'%');
        }

        if ($request->filled('employment_types')) {
            $query->whereIn('employment_type', $request->employment_types);
        }

        if ($request->filled('industries')) {
            $query->whereIn('industry', $request->industries);
        }

        $jobs = $query->latest()->get();

        $jobs = $this->addSaveStatusToJobs($jobs, Auth::user());

        return inertia('jobseeker/jobs/all-jobs', [
            'jobs' => $jobs,
            'filters' => $request->only('company', 'job_title', 'employment_types', 'industries'),
        ]);
    }

    public function show(string $jobId): Response
    {
        $job = Opening::with(['company', 'skills'])->find($jobId);

        $user = Auth::user();

        $job = $this->addSaveStatusToJob($job, $user);
        $job = $this->addApplicationStatusToJob($job, $user);

        $similar_jobs = Opening::where('title', 'LIKE', '%'.$job->title.'%')
            ->where('id', '!=', $job->id)
            ->where('verification_status', VerificationStatusEnum::Verified->value)
            ->where('expires_at', '>', now())
            ->with('company')
            ->latest()
            ->get();

        return Inertia::render('jobseeker/jobs/job-details', [
            'job' => $job,
            'similar_jobs' => $similar_jobs,
        ]);
    }

    public function savedJobs(Request $request)
    {
        $count = (int) $request->input('count', 10);
        $user = Auth::user();
        $jobs = $user->savedOpenings()->with('opening.company')->get();
        $jobs = $jobs->pluck('opening')->filter()->values();
        $jobs = $this->addSaveStatusToJobs($jobs, $user);

        $jobs = $jobs->take($count);

        return Inertia::render('jobseeker/jobs/saved-jobs', [
            'jobs' => $jobs,
            'count' => $count,
        ]);
    }

    public function appliedJobs(Request $request)
    {
        $count = (int) $request->input('count', 10);

        $user = Auth::user();
        $jobs = $user->openingApplications()->with('opening.company')->get();
        $jobs = $jobs->pluck('opening')->filter()->values();
        $jobs = $this->addApplicationStatusToJobs($jobs, $user);

        $jobs = $jobs->take($count);

        return Inertia::render('jobseeker/jobs/applied-jobs', [
            'jobs' => $jobs,
            'count' => $count,
        ]);
    }
}
