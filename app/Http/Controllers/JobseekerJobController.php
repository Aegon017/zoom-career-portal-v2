<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Enums\VerificationStatusEnum;
use App\Models\Opening;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

final class JobseekerJobController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Opening::query()
            ->where('verification_status', VerificationStatusEnum::Verified->value)
            ->where('expires_at', '>', now())
            ->with('company');

        if ($request->filled('company')) {
            $query->whereHas(
                'company',
                fn ($q) => $q->where('name', 'like', '%'.$request->company.'%')
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

        $initialJobs = $query->latest()->paginate(10);

        return inertia('jobseeker/jobs/all-jobs', [
            'initialJobs' => $initialJobs,
            'filters' => $request->only('company', 'job_title', 'employment_types', 'industries'),
        ]);
    }

    public function show(string $jobId): Response
    {
        $job = Opening::with(['company', 'skills', 'company.industry'])->find($jobId);

        Auth::user();

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

    public function savedJobs()
    {
        $user = Auth::user();
        $savedJobs = $user->savedOpenings()->with('opening', 'opening.company')->paginate(10);

        return Inertia::render('jobseeker/jobs/saved-jobs', [
            'initialSavedJobs' => $savedJobs,
        ]);
    }

    public function appliedJobs()
    {
        $user = Auth::user();
        $jobs = $user->openingApplications()->with('opening.company')->paginate(10);
        $initialJobs = $jobs->pluck('opening')->filter()->values();

        return Inertia::render('jobseeker/jobs/applied-jobs', [
            'initialJobs' => $initialJobs,
        ]);
    }
}
