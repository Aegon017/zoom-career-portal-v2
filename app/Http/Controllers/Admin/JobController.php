<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Enums\JobApplicationStatusEnum;
use App\Http\Controllers\Controller;
use App\Models\Opening;
use App\Models\OpeningApplication;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

final class JobController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $jobs = Opening::query()
            ->with('company', 'user')
            ->when(
                $request->search,
                fn($q) => $q->where('title', 'like', '%' . $request->search . '%')
            )
            ->paginate($request->perPage ?? 10)
            ->withQueryString();

        return Inertia::render('admin/jobs/jobs-listing', [
            'jobs' => $jobs,
            'filters' => $request->only('search', 'perPage'),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): void
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): void
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Opening $job)
    {
        return Inertia::render('admin/jobs/view-job', [
            'job' => $job->load('address.location'),
        ]);
    }

    public function applications(Opening $job, Request $request)
    {
        $statuses = JobApplicationStatusEnum::options();

        $validated = $request->validate([
            'status' => 'nullable|string|in:' . implode(',', array_keys($statuses)),
            'matching_score_range' => 'nullable|string|in:1-10,10-20,20-30,30-40,40-50,50-60,60-70,70-80,80-90,90-100',
        ]);

        $query = $job->applications()->with('user', 'resume');

        if (isset($validated['status'])) {
            $query->where('status', $validated['status']);
        }

        if (isset($validated['matching_score_range'])) {
            $range = explode('-', $validated['matching_score_range']);
            $minScore = $range[0];
            $maxScore = $range[1];

            $query->whereBetween('match_score', [$minScore, $maxScore]);
        }

        $applications = $query->get();

        $appliedUserIds = $applications->pluck('user_id')->toArray();

        $users = User::role('jobseeker')
            ->whereNotIn('id', $appliedUserIds)
            ->get()
            ->map(fn($user): array => [
                'value' => $user->id,
                'label' => $user->email,
            ]);

        return Inertia::render('admin/jobs/job-applications', [
            'job' => $job,
            'applications' => $applications,
            'statuses' => $statuses,
            'users' => $users,
            'exportUrl' => route('admin.jobs.applications.export', $job),
            'filters' => $validated,
        ]);
    }

    public function storeApplications(Opening $job, Request $request)
    {
        $data = $request->validate([
            'user_ids' => 'required|array',
            'user_ids.*' => 'integer|exists:users,id',
        ]);

        foreach ($data['user_ids'] as $userId) {
            OpeningApplication::create([
                'user_id' => $userId,
                'opening_id' => $job->id,
                'status' => JobApplicationStatusEnum::Applied->value,
            ]);
        }

        return back()->with('success', 'Applications submitted successfully.');
    }
}
