<?php

namespace App\Http\Controllers\JobSeeker;

use App\Http\Controllers\Controller;
use App\Models\JobPosting;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $jobs = JobPosting::with('company')->latest()->get();
        return Inertia::render('jobseeker/explore', [
            'jobs' => $jobs
        ]);
    }
}
