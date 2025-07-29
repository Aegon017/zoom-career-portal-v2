<?php

declare(strict_types=1);

namespace App\Http\Controllers\Employer;

use App\Enums\JobApplicationStatusEnum;
use App\Events\MessageSent;
use App\Http\Controllers\Controller;
use App\Mail\Application\ShortlistedMail;
use App\Models\Chat;
use App\Models\Opening;
use App\Models\OpeningApplication;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Symfony\Component\HtmlSanitizer\HtmlSanitizer;
use Symfony\Component\HtmlSanitizer\HtmlSanitizerConfig;

final class ApplicationsController extends Controller
{
    public function index(Request $request)
    {
        $jobs = Opening::where('user_id', Auth::id())->get();
        $job = Opening::find($request->job_id);

        $applications = collect();
        $skills = collect();

        if ($job) {
            $applicationsQuery = $job->applications()->with(['user.skills', 'resume']);

            if ($request->filled('skill') && $request->skill !== 'all') {
                $applicationsQuery->whereHas('user.skills', function ($q) use ($request): void {
                    $q->where('name', $request->skill);
                });
            }

            if ($request->filled('status') && $request->status !== 'all') {
                $applicationsQuery->where('status', $request->status);
            }

            $applications = $applicationsQuery->orderBy('match_score', 'desc')->get();

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
            default => '',
        };

        return back()->with('success', 'Status updated successfully');
    }

    public function messageShortlisted(Request $request, Opening $job)
    {
        $request->validate([
            'subject' => 'required|string|max:255',
            'message' => 'required|string|max:1000',
        ]);

        $shortlistedUsers = User::whereIn('id', OpeningApplication::where('opening_id', $job->id)
            ->where('status', JobApplicationStatusEnum::Shortlisted->value)
            ->pluck('user_id'))
            ->get();

        $htmlSanitizer = new HtmlSanitizer((new HtmlSanitizerConfig())->allowSafeElements());

        $safeMessage = $htmlSanitizer->sanitize($request->message);

        $combinedMessage = sprintf('<strong>Subject:</strong> %s<br><br>%s', $request->subject, $safeMessage);

        foreach ($shortlistedUsers as $user) {
            $chat = Chat::whereHas('participants', fn ($q) => $q->where('user_id', Auth::id()))
                ->whereHas('participants', fn ($q) => $q->where('user_id', $user->id))
                ->withCount('participants')
                ->get()
                ->first(fn ($chat): bool => $chat->participants_count === 2);

            if (! $chat) {
                $chat = Chat::create();
                $chat->participants()->createMany([
                    ['user_id' => Auth::id()],
                    ['user_id' => $user->id],
                ]);
            }

            $message = $chat->messages()->create([
                'user_id' => Auth::id(),
                'message' => $combinedMessage,
            ]);

            MessageSent::dispatch($message);
        }

        return back()->with('success', 'Message sent to all shortlisted candidates.');
    }
}
