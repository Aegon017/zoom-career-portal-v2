<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Enums\EmploymentTypeEnum;
use App\Enums\VerificationStatusEnum;
use App\Models\Industry;
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
            ->with('company.industry'); // Eager load company's industry

        // Company filter
        if ($request->filled('company')) {
            $query->whereHas('company', function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->company . '%');
            });
        }

        // Job title filter
        if ($request->filled('job_title')) {
            $query->where('title', 'like', '%' . $request->job_title . '%');
        }

        // Employment types filter
        $employmentTypes = $request->input('employment_types', []);
        if (!empty($employmentTypes)) {
            if (!is_array($employmentTypes)) {
                $employmentTypes = [$employmentTypes];
            }
            $query->whereIn('employment_type', $employmentTypes);
        }

        // Industries filter - now using industry IDs
        $industryIds = $request->input('industries', []);
        if (!empty($industryIds)) {
            if (!is_array($industryIds)) {
                $industryIds = [$industryIds];
            }
            $query->whereHas('company', function ($q) use ($industryIds) {
                $q->whereHas('industry', function ($q) use ($industryIds) {
                    $q->whereIn('id', $industryIds);
                });
            });
        }

        // Get distinct industries with active openings
        $industries = Industry::whereHas('companies.openings', function ($q) {
            $q->where('verification_status', VerificationStatusEnum::Verified->value)
                ->where('expires_at', '>', now());
        })
            ->select('id', 'name')
            ->orderBy('name')
            ->get();

        $initialJobs = $query->latest()->paginate(10);

        return inertia('jobseeker/jobs/all-jobs', [
            'initialJobs' => $initialJobs,
            'employmentTypes' => EmploymentTypeEnum::options(),
            'industries' => $industries, // Pass industries to frontend
            'filters' => [
                'company' => $request->input('company', ''),
                'job_title' => $request->input('job_title', ''),
                'employment_types' => $employmentTypes,
                'industries' => $industryIds, // Use IDs instead of names
            ],
        ]);
    }

    public function show(string $jobId): Response
    {
        $job = Opening::with(['company', 'skills', 'company.industry'])->find($jobId);

        Auth::user();

        $similar_jobs = Opening::where('title', 'LIKE', '%' . $job->title . '%')
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
