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
use App\Notifications\ShortlistedMessageNotification;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Symfony\Component\HtmlSanitizer\HtmlSanitizer;
use Symfony\Component\HtmlSanitizer\HtmlSanitizerConfig;
use ZipArchive;

final class ApplicationsController extends Controller
{
    public function index(Request $request)
    {
        $jobs = Opening::where('user_id', Auth::id())->where('expires_at', '>=', now())->get();
        $job = Opening::find($request->job_id);

        $matchScoreCutoff = $job?->company?->match_score_cutoff;

        $applications = collect();
        $skills = collect();

        if ($job) {
            $applicationsQuery = $job->applications()->with(['user', 'resume']);

            if ($request->filled('status') && $request->status !== 'all') {
                $applicationsQuery->where('status', $request->status);
            }

            $applications = $applicationsQuery->where('match_score', '>=', $matchScoreCutoff ?? 0)->orderBy('match_score', 'desc')->get();
        }

        $statuses = JobApplicationStatusEnum::options();

        return Inertia::render('employer/applications/index', [
            'jobs' => $jobs,
            'applications' => $applications,
            'job_id' => $request->job_id,
            'statuses' => $statuses,
            'exportUrl' => $request->job_id ? route('employer.applications.export', $request->job_id) : '',
            'hasExport' => true,
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
            $chat = Chat::whereHas('participants', fn($q) => $q->where('user_id', Auth::id()))
                ->whereHas('participants', fn($q) => $q->where('user_id', $user->id))
                ->withCount('participants')
                ->get()
                ->first(fn($chat): bool => $chat->participants_count === 2);

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

            $user->notify(new ShortlistedMessageNotification($request->subject, $request->message));

            MessageSent::dispatch($message);
        }

        return back()->with('success', 'Message sent to all shortlisted candidates.');
    }

    public function downloadSelectedResumes(Opening $job, Request $request)
    {
        $statuses = JobApplicationStatusEnum::options();

        $validated = $request->validate([
            'application_ids' => 'nullable|array',
            'application_ids.*' => 'integer|exists:opening_applications,id',
            'status' => 'nullable|string|in:' . implode(',', array_keys($statuses)),
        ]);

        $query = $job->applications()->with(['user', 'resume.media']);

        if (isset($validated['application_ids']) && ! empty($validated['application_ids'])) {
            $query->whereIn('id', $validated['application_ids']);
        }

        if (isset($validated['status'])) {
            $query->where('status', $validated['status']);
        }

        if ($query->count() === 0) {
            return response()->json(['error' => 'No applications found'], 404);
        }

        $isAllApplications = ! isset($validated['application_ids']) || empty($validated['application_ids']);
        $zipFileName = ($isAllApplications ? 'resumes_' : 'selected_resumes_') . $job->id . '_' . now()->timestamp . '.zip';
        $zipPath = storage_path('app/' . $zipFileName);

        if (! file_exists(storage_path('app'))) {
            mkdir(storage_path('app'), 0755, true);
        }

        $zip = new ZipArchive();
        if ($zip->open($zipPath, ZipArchive::CREATE | ZipArchive::OVERWRITE) !== true) {
            return response()->json(['error' => 'Failed to create zip file'], 500);
        }

        $addedFiles = 0;

        $query->chunk(200, function ($applications) use ($zip, &$addedFiles): void {
            foreach ($applications as $application) {
                if (! $application->resume) {
                    continue;
                }

                $media = $application->resume->getFirstMedia('resumes');
                if (! $media) {
                    continue;
                }

                try {
                    $safeName = Str::slug($application->user->name) . '_' . $application->id . '.' . $media->extension;
                    $filePath = $media->getPath();

                    if (file_exists($filePath)) {
                        $zip->addFile($filePath, $safeName);
                        ++$addedFiles;
                    }
                } catch (Exception $e) {
                    Log::error('Error adding file to zip: ' . $e->getMessage());

                    continue;
                }
            }
        });

        $zip->close();

        if ($addedFiles === 0) {
            if (file_exists($zipPath)) {
                unlink($zipPath);
            }

            return response()->json(['error' => 'No resume files found to download'], 404);
        }

        return response()->download($zipPath, $zipFileName)->deleteFileAfterSend();
    }
}
