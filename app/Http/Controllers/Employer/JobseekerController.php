<?php

namespace App\Http\Controllers\Employer;

use App\Http\Controllers\Controller;
use App\Models\Jobseeker;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class JobseekerController extends Controller
{
    public function index(): Response
    {
        $jobseekers = Jobseeker::get();

        return Inertia::render('employer/jobseeker/index', [
            'jobseekers' => $jobseekers
        ]);
    }
}
