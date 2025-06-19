<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Enums\JobApplicationStatusEnum;
use App\Models\Opening;
use App\Models\OpeningApplication;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

final class JobApplicationController extends Controller
{
    public function store(Request $request, string $jobId)
    {
        $request->validate([
            'cover_letter' => 'nullable|string',
            'resume_id' => 'required_without:resume|nullable|integer|exists:media,id',
            'resume' => 'required_without:resume_id|nullable|string',
        ]);

        $user = Auth::user();

        $application = OpeningApplication::create([
            'user_id' => $user->id,
            'opening_id' => $jobId,
            'cover_letter' => $request->cover_letter,
            'status' => JobApplicationStatusEnum::Applied->value,
        ]);

        try {
            if ($request->filled('resume_id')) {
                $resume = $user->getMedia('resumes')->firstWhere('id', $request->resume_id);

                if (! $resume) {
                    throw new Exception('Resume not found or does not belong to you.');
                }

                $resume->copy($application, 'resumes');
            } elseif ($request->filled('resume') && Storage::disk('public')->exists($request->resume)) {
                $application
                    ->addMedia(storage_path('app/public/'.$request->resume))
                    ->preservingOriginal()
                    ->toMediaCollection('resumes');
                $user->addMedia(storage_path('app/public/'.$request->resume))
                    ->preservingOriginal()
                    ->toMediaCollection('resumes');
            } else {
                throw new Exception('No valid resume provided.');
            }

            return back()->with('success', 'Application submitted successfully.');
        } catch (Exception $exception) {
            $application->delete();

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

    public function index(string $jobId)
    {
        $job = Opening::find($jobId);

        $applications = $job->applications()->with('user')->latest()->get();

        return inertia('Employer/JobApplications', [
            'job' => $job,
            'applications' => $applications,
        ]);
    }
}
