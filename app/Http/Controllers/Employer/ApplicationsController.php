<?php

declare(strict_types=1);

namespace App\Http\Controllers\Employer;

use App\Http\Controllers\Controller;
use App\Models\Opening;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

final class ApplicationsController extends Controller
{
    public function index(Request $request)
    {
        $jobs = Opening::where('user_id', Auth::id())->get();

        $job = Opening::find($request?->job_id);

        $applications = $job?->applications()->with('user')->get();

        return Inertia::render('employer/applications/index', [
            'jobs' => $jobs,
            'applications' => $applications,
            'job' => $job,
        ]);
    }
}
