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

        $job = Opening::find($request?->job_id);

        $applications = $job?->applications()->with('user')->get();

        $statuses = JobApplicationStatusEnum::options();

        return Inertia::render('employer/applications/index', [
            'jobs' => $jobs,
            'applications' => $applications,
            'job' => $job,
            'statuses' => $statuses,
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
            JobApplicationStatusEnum::Rejected->value => Mail::to($user)->send(new RejectedMail($user->name, $opening->title, $company->name)),
            default => '',
        };

        return back()->with('success', 'Status updated successfully');
    }
}
