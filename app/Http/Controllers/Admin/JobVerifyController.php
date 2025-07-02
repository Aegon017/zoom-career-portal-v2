<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Enums\VerificationStatusEnum;
use App\Http\Controllers\Controller;
use App\Mail\Employer\JobVerificationStatusMail;
use App\Mail\Jobseeker\JobPostedMail;
use App\Models\Opening;
use App\Notifications\Jobseeker\JobPostedNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

final class JobVerifyController extends Controller
{
    public function verify(Request $request)
    {
        $jobId = $request->job;
        $job = Opening::find($jobId);

        return Inertia::render('admin/jobs/verify', [
            'job' => $job,
        ]);
    }

    public function store(Opening $opening, Request $request)
    {
        if ($request->has('verification_status')) {
            $opening->verification_status = $request->verification_status;
            $opening->save();
            $reason = $request->rejection_reason;
            Mail::to($opening->user)->send(new JobVerificationStatusMail($opening->title, $opening->verification_status, $reason));
        }

        if ($opening->verification_status === VerificationStatusEnum::Verified->value) {
            $followers = $opening->company->followers;
            foreach ($followers as $follower) {
                $follower->notify(new JobPostedNotification($follower, $opening));
                Mail::to($follower)->send(new JobPostedMail($follower, $opening));
            }
        }

        return back()->with('success', 'Job status updated successfully');
    }
}
