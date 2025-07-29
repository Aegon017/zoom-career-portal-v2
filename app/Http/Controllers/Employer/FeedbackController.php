<?php

namespace App\Http\Controllers\Employer;

use App\Http\Controllers\Controller;
use App\Models\Feedback;
use App\Models\Opening;
use App\Models\User;
use App\Notifications\Admin\FeedbackSubmittedNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Notification;
use Inertia\Inertia;
use Inertia\Response;

class FeedbackController extends Controller
{
    public function create(Opening $job): Response
    {
        $candidateOptions = $job->applications()
            ->with('user:id,name,email')
            ->get()
            ->map(fn($app) => [
                'value' => $app->user->email,
                'label' => $app->user->name . " (" . $app->user->email . ")",
            ])
            ->prepend([
                'value' => 'not_hired',
                'label' => 'Not Hired',
            ])
            ->values();

        return Inertia::render('employer/jobs/feedback', [
            'job' => $job->load('company'),
            'candidateOptions' => $candidateOptions,
        ]);
    }

    public function store(Request $request, Opening $job)
    {
        $request->validate([
            'feedback' => 'required|string',
            'hiredDetails' => 'required|string',
            'selectedCandidates' => 'required|array|min:1',
            'additionalComments' => 'required|string',
        ]);

        $exists = Feedback::where('user_id', Auth::id())
            ->where('opening_id', $job->id)
            ->exists();

        if ($exists) {
            return back()->withErrors(['error' => 'You have already submitted feedback for this job.']);
        }

        $feedback =  Feedback::create([
            'user_id' => Auth::id(),
            'opening_id' => $job->id,
            'feedback' => $request->feedback,
            'hired_details' => $request->hiredDetails,
            'selected_candidates' => $request->selectedCandidates,
            'additional_comments' => $request->additionalComments,
        ]);

        $admins = User::role('super_admin')->get();

        Notification::send($admins, new FeedbackSubmittedNotification($feedback));

        return redirect()->route('employer.jobs.index')->with('success', 'Feedback submitted successfully.');
    }
}
