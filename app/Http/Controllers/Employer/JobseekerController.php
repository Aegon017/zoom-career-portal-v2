<?php

declare(strict_types=1);

namespace App\Http\Controllers\Employer;

use App\Http\Controllers\Controller;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

final class JobseekerController extends Controller
{
    public function index(): Response
    {
        $jobseekers = User::role('jobseeker')->get();

        return Inertia::render('employer/jobseeker/index', [
            'jobseekers' => $jobseekers,
        ]);
    }
}
