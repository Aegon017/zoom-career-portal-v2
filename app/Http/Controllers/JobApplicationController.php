<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Enums\JobApplicationStatusEnum;
use App\Jobs\ProcessResume;
use App\Models\Opening;
use App\Models\OpeningApplication;
use App\Models\Resume;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Spatie\MediaLibrary\MediaCollections\Exceptions\FileCannotBeAdded;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

final class JobApplicationController extends Controller
{
    public function store(Request $request, int $jobId)
    {
        $request->validate([
            'cover_letter' => 'nullable|string',
            'resume_id' => 'required_without:resume|nullable|integer',
            'resume' => 'required_without:resume_id|nullable|string',
        ]);

        $user = Auth::user();
        $resumeId = null;

        try {
            if ($request->filled('resume_id')) {
                $media = Media::find($request->resume_id);
                $resume = Resume::find($media->model_id);
                if (! $resume) {
                    throw new Exception('Resume not found or does not belong to you.');
                }

                $resumeId = $resume->id;
            } elseif ($request->filled('resume')) {
                $path = $request->resume;

                if (! Storage::exists($path)) {
                    throw new Exception('File not found. Please upload again.');
                }

                $resume = $user->resumes()->create();

                try {
                    $resume->addMediaFromDisk($path)->toMediaCollection('resumes');
                } catch (FileCannotBeAdded) {
                    $resume->delete();
                    throw new Exception('Invalid file type. Only PDF resumes are allowed.');
                }

                $resumeId = $resume->id;
            } else {
                throw new Exception('No valid resume provided.');
            }

            ProcessResume::dispatch($resume);

            OpeningApplication::create([
                'user_id' => $user->id,
                'opening_id' => $jobId,
                'resume_id' => $resumeId,
                'cover_letter' => $request->cover_letter,
                'status' => JobApplicationStatusEnum::Applied->value,
            ]);

            return back()->with('success', 'Application submitted successfully.');
        } catch (Exception $exception) {
            return back()->withErrors(['resume' => $exception->getMessage()]);
        }
    }

    public function destroy(string $jobId)
    {
        $user = Auth::user();

        $job = Opening::find($jobId);

        $application = $job->applications()->where('user_id', $user->id)->first();

        if (! $application) {
            return back()->withErrors(['application' => 'You have not applied for this job.']);
        }

        $application->delete();

        return back()->with('success', 'Application withdrawn.');
    }
}
