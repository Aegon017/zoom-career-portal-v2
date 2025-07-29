<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Enums\EmploymentTypeEnum;
use App\Enums\JobApplicationStatusEnum;
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
            $query->whereHas('company', function ($q) use ($request): void {
                $q->where('name', 'like', '%'.$request->company.'%');
            });
        }

        // Job title filter
        if ($request->filled('job_title')) {
            $query->where('title', 'like', '%'.$request->job_title.'%');
        }

        // Employment types filter
        $employmentTypes = $request->input('employment_types', []);
        if (! empty($employmentTypes)) {
            if (! is_array($employmentTypes)) {
                $employmentTypes = [$employmentTypes];
            }

            $query->whereIn('employment_type', $employmentTypes);
        }

        // Industries filter - now using industry IDs
        $industryIds = $request->input('industries', []);
        if (! empty($industryIds)) {
            if (! is_array($industryIds)) {
                $industryIds = [$industryIds];
            }

            $query->whereHas('company', function ($q) use ($industryIds): void {
                $q->whereHas('industry', function ($q) use ($industryIds): void {
                    $q->whereIn('id', $industryIds);
                });
            });
        }

        // Get distinct industries with active openings
        $industries = Industry::whereHas('companies.openings', function ($q): void {
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
        $job = Opening::with(['company', 'skills', 'company.industry', 'address.location'])->find($jobId);

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

        $applications = $user->openingApplications()
            ->with(['opening.company', 'opening.address'])
            ->when(request('search'), function ($query, $search): void {
                $query->whereHas('opening', fn ($q) => $q->where('title', 'like', sprintf('%%%s%%', $search)));
            })
            ->when(request('status'), fn ($query, $status) => $query->where('status', $status))
            ->when(request('after_date'), fn ($query, $date) => $query->whereDate('created_at', '>=', $date))
            ->when(request('before_date'), fn ($query, $date) => $query->whereDate('created_at', '<=', $date))
            ->orderByDesc('created_at')
            ->paginate(10);

        $jobs = $applications->getCollection()->map(fn ($application): array => [
            'id' => $application->opening_id,
            'title' => $application->opening->title,
            'description' => $application->opening->description,
            'company' => $application->opening->company,
            'city' => $application->opening->address?->city,
            'country' => $application->opening->address?->country,
            'application_status' => $application->status,
            'application_created_at' => $application->created_at,
        ]);

        return Inertia::render('jobseeker/jobs/applied-jobs', [
            'initialJobs' => $jobs,
            'pagination' => [
                'current_page' => $applications->currentPage(),
                'last_page' => $applications->lastPage(),
                'per_page' => $applications->perPage(),
                'total' => $applications->total(),
            ],
            'applicationStatusOptions' => JobApplicationStatusEnum::options(),
        ]);
    }
}
