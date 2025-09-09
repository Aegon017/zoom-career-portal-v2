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
            $applicationsQuery = $job->applications()->with(['user.skills', 'resume']);

            if ($request->filled('status') && $request->status !== 'all') {
                $applicationsQuery->where('status', $request->status);
            }

            $applications = $applicationsQuery
                ->where('match_score', '>=', $matchScoreCutoff ?? 0)
                ->orderBy('match_score', 'desc')
                ->get();

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

    public function downloadResumes(Request $request)
    {
        Log::info('Download resumes initiated', ['request' => $request->all()]);

        $applications = OpeningApplication::query()
            ->when($request->job_id, fn($q) => $q->where('opening_id', $request->job_id))
            ->when($request->status, fn($q) => $q->where('status', $request->status))
            ->when($request->skill, fn($q) => $q->whereJsonContains('skills', $request->skill))
            ->with(['resume.media', 'user'])
            ->get();

        Log::debug('Applications count: ' . $applications->count());

        if ($applications->isEmpty()) {
            Log::warning('No applications found for download');

            return back()->with('error', 'No applications found');
        }

        $zip = new ZipArchive();
        $fileName = 'resumes-' . now()->format('Ymd-His') . '.zip';
        $path = storage_path('app/' . $fileName);
        $filesAdded = false;

        Log::info('Creating zip file: ' . $path);

        try {
            if ($zip->open($path, ZipArchive::CREATE | ZipArchive::OVERWRITE) !== true) {
                $error = 'Failed to create zip file at: ' . $path;
                Log::error($error);
                throw new Exception($error);
            }

            $addedCount = 0;
            $skippedCount = 0;

            foreach ($applications as $application) {
                try {
                    // Skip if relationships are missing
                    if (! $application->resume || ! $application->user) {
                        ++$skippedCount;
                        Log::debug(sprintf('Skipping application %s: missing resume or user', $application->id));

                        continue;
                    }

                    /** @var Media|null $media */
                    $media = $application->resume->getFirstMedia('resumes');
                    if (! $media) {
                        ++$skippedCount;
                        Log::debug(sprintf('Skipping resume %s: no media found', $application->resume_id));

                        continue;
                    }

                    // Get the actual file path from media model
                    $filePath = $media->getPath();

                    // Verify file exists at path
                    if (! file_exists($filePath)) {
                        ++$skippedCount;
                        Log::warning('File not found: ' . $filePath);

                        continue;
                    }

                    // Sanitize filename
                    $safeName = Str::slug($application->user->name);
                    $extension = pathinfo((string) $filePath, PATHINFO_EXTENSION);
                    $fileNameInZip = sprintf('%s-Resume-%s.%s', $safeName, $application->resume_id, $extension);

                    // Add file directly from disk (more memory efficient)
                    if ($zip->addFile($filePath, $fileNameInZip)) {
                        ++$addedCount;
                        $filesAdded = true;
                        Log::debug('Added to zip: ' . $fileNameInZip);
                    } else {
                        ++$skippedCount;
                        Log::warning('Failed to add to zip: ' . $fileNameInZip);
                    }
                } catch (Exception $e) {
                    ++$skippedCount;
                    Log::error(sprintf('Error processing application %s: ', $application->id) . $e->getMessage());
                }
            }

            $zip->close();
            Log::info(sprintf('Zip closed. Added: %d, Skipped: %d', $addedCount, $skippedCount));

            if (! $filesAdded) {
                if (file_exists($path)) {
                    unlink($path);
                    Log::info('Deleted empty zip file');
                }

                Log::warning('No valid resumes found for download');

                return back()->with('error', 'No valid resumes found for download');
            }

            Log::info('Returning download response');

            return response()->download($path, $fileName)->deleteFileAfterSend();
        } catch (Exception $exception) {
            $zip->close();

            Log::error('Zip creation failed: ' . $exception->getMessage());

            return back()->with('error', 'Error creating zip file: ' . $exception->getMessage());
        }
    }
}
