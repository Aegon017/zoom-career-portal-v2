<?php

declare(strict_types=1);

namespace App\Http\Controllers\Jobseeker;

use App\Enums\VerificationStatusEnum;
use App\Http\Controllers\Controller;
use App\Models\Opening;
use App\Traits\JobHelpers;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

final class JobseekerDashboardController extends Controller
{
    use JobHelpers;

    public function index(): Response
    {
        $jobs = Opening::where('verification_status', VerificationStatusEnum::Approved->value)
            ->where('expires_at', '>', now())
            ->latest()
            ->with('company')
            ->get();

        $jobs = $this->addSaveStatusToJobs($jobs, Auth::user());

        return Inertia::render('jobseeker/explore', [
            'openings' => $jobs,
        ]);
    }
}
