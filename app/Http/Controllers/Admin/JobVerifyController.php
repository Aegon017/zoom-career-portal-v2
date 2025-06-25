<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Mail\Employer\JobVerificationStatusMail;
use App\Models\Opening;
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
        if ($request->has('status')) {
            $opening->verification_status = $request->status;
            $opening->save();
            Mail::to($opening->user)->send(new JobVerificationStatusMail($opening->title, $opening->verification_status));
        }

        return back()->with('success', 'Job status updated successfully');
    }
}
