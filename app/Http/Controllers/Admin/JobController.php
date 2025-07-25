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
            'job' => $job,
        ]);
    }

    public function applications(Opening $job, Request $request)
    {
        $statuses = JobApplicationStatusEnum::options();
        $applications = $job->applications()->with('user')->get();
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
