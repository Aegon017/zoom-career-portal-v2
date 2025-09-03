<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Enums\EmploymentTypeEnum;
use App\Enums\JobApplicationStatusEnum;
use App\Enums\VerificationStatusEnum;
use App\Models\Company;
use App\Models\Industry;
use App\Models\Location;
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
            ->with('company.industry', 'address.location');

        // Job title filter
        if ($request->filled('job_title')) {
            $query->where('title', 'like', '%'.$request->job_title.'%');
        }

        // Employment types filter
        $employmentTypes = $request->input('employment_types', []);
        if (! empty($employmentTypes)) {
            $query->whereIn('employment_type', $employmentTypes);
        }

        // Industries filter
        $industryIds = $request->input('industries', []);
        if (! empty($industryIds)) {
            $query->whereHas('company', function ($q) use ($industryIds): void {
                $q->whereHas('industry', function ($q) use ($industryIds): void {
                    $q->whereIn('id', $industryIds);
                });
            });
        }

        // Selected companies filter
        $selectedCompanies = $request->input('selected_companies', []);
        if (! empty($selectedCompanies)) {
            $query->whereIntegerInRaw('company_id', $selectedCompanies);
        }

        // Get distinct industries with active openings
        $industries = Industry::whereHas('companies.openings', function ($q): void {
            $q->where('verification_status', VerificationStatusEnum::Verified->value)
                ->where('expires_at', '>', now());
        })
            ->select('id', 'name')
            ->orderBy('name')
            ->get();

        $companies = Company::get();

        $initialJobs = $query->latest()->paginate(10);

        $locationIds = $request->input('locations', []);
        if (! empty($locationIds)) {
            $query->whereHas('address', function ($q) use ($locationIds): void {
                $q->whereIntegerInRaw('location_id', $locationIds);
            });
        }

        $locations = Location::whereHas('addresses', function ($q): void {
            $q->whereHasMorph(
                'addressable',
                [Opening::class],
                function ($q): void {
                    $q->where('verification_status', VerificationStatusEnum::Verified->value)
                        ->where('expires_at', '>', now());
                }
            );
        })
            ->select('id', 'country', 'state', 'city')
            ->get()
            ->map(fn($location): array => [
                'id' => $location->id,
                'full_name' => $location->full_name,
            ]);

        return inertia('jobseeker/jobs/all-jobs', [
            'initialJobs' => $initialJobs,
            'employmentTypes' => EmploymentTypeEnum::options(),
            'industries' => $industries,
            'companies' => $companies,
            'locations' => $locations,
            'filters' => [
                'job_title' => $request->input('job_title', ''),
                'employment_types' => $employmentTypes,
                'industries' => $industryIds,
                'selected_companies' => $selectedCompanies,
                'locations' => $locationIds,
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
