<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Opening;
use Illuminate\Http\Request;
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
        }

        return back()->with('success', 'Job status updated successfully');
    }
}
