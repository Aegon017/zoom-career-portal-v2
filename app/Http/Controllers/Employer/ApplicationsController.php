<?php

declare(strict_types=1);

namespace App\Http\Controllers\Employer;

use App\Enums\JobApplicationStatusEnum;
use App\Http\Controllers\Controller;
use App\Mail\Application\RejectedMail;
use App\Mail\Application\ShortlistedMail;
use App\Models\Opening;
use App\Models\OpeningApplication;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

final class ApplicationsController extends Controller
{
    public function index(Request $request)
    {
        $jobs = Opening::where('user_id', Auth::id())->get();
        $job = Opening::find($request->job_id);

        $applications = collect();
        $skills = collect();

        if ($job) {
            // Load applications with user and skills
            $applicationsQuery = $job->applications()->with(['user.skills']);

            if ($request->filled('skill') && $request->skill !== 'all') {
                $applicationsQuery->whereHas('user.skills', function ($q) use ($request) {
                    $q->where('name', $request->skill);
                });
            }

            $applications = $applicationsQuery->get();

            $skills = $job->skills()->pluck('name')->unique()->values();
        }

        $statuses = JobApplicationStatusEnum::options();

        return Inertia::render('employer/applications/index', [
            'jobs' => $jobs,
            'applications' => $applications,
            'job_id' => $request->job_id,
            'statuses' => $statuses,
            'skills' => $skills,
            'selectedSkill' => $request->skill ?? 'all',
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'applicationId' => ['required', 'exists:opening_applications,id'],
            'status' => ['required', Rule::enum(JobApplicationStatusEnum::class)],
        ]);

        $application = OpeningApplication::find($data['applicationId']);

        $application->status = $data['status'];
        $application->save();

        $user = $application->user;
        $opening = $application->opening;
        $company = $opening->company;

        match ($application->status) {
            JobApplicationStatusEnum::Shortlisted->value => Mail::to($user)->send(new ShortlistedMail($user->name, $opening->title, $company->name)),
            // JobApplicationStatusEnum::Rejected->value => Mail::to($user)->send(new RejectedMail($user->name, $opening->title, $company->name)),
            default => '',
        };

        return back()->with('success', 'Status updated successfully');
    }
}
