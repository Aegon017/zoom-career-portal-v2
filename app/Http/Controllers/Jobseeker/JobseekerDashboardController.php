<?php

declare(strict_types=1);

namespace App\Http\Controllers\Jobseeker;

use App\Enums\VerificationStatusEnum;
use App\Http\Controllers\Controller;
use App\Models\Opening;
use Inertia\Inertia;
use Inertia\Response;

final class JobseekerDashboardController extends Controller
{
    public function index(): Response
    {
        $jobs = Opening::where('verification_status', VerificationStatusEnum::Verified->value)
            ->where('expires_at', '>', now())
            ->latest()
            ->with('company')
            ->get();

        return Inertia::render('jobseeker/explore', [
            'openings' => $jobs,
        ]);
    }
}
