<?php

namespace App\Http\Controllers\Admin;

use App\Enums\VerificationStatusEnum;
use App\Http\Controllers\Controller;
use App\Models\Company;
use App\Models\Opening;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class VerificationController extends Controller
{
    public function index()
    {
        $pendingCompanies = Company::where('verification_status', VerificationStatusEnum::Pending->value)->get();
        $pendingStudents = User::role('jobseeker')
            ->whereHas('profile', function ($query) {
                $query->where('is_verified', false);
            })
            ->get();
        $pendingEmployers = User::role('employer')
            ->whereHas('companyUsers', function ($query) {
                $query->where('verification_status', VerificationStatusEnum::Pending->value);
            })
            ->get();
        $pendingJobs = Opening::where('verification_status', VerificationStatusEnum::Pending->value)->get();

        $companyVerifications = $pendingCompanies->map(fn($company) => [
            'message' => 'Company updated and needs verification: ' . $company->name,
            'url' => route('admin.companies.show', $company->id),
        ]);

        $studentVerifications = $pendingStudents->map(fn($user) => [
            'message' => 'Student profile needs verification: ' . $user->name,
            'url' => route('admin.students.show', $user->id),
        ]);

        $employerVerifications = $pendingEmployers->map(fn($user) => [
            'message' => 'Employer account needs verification: ' . $user->name,
            'url' => route('admin.recruiters.show', $user->id),
        ]);

        $jobVerifications = $pendingJobs->map(fn($job) => [
            'message' => 'Job opening pending verification: ' . $job->title,
            'url' => route('admin.jobs.show', $job->id),
        ]);

        $pendingVerifications = collect()
            ->merge($companyVerifications)
            ->merge($studentVerifications)
            ->merge($employerVerifications)
            ->merge($jobVerifications)
            ->values();

        return Inertia::render('admin/pending-verifications-listing', [
            'pendingVerifications' => $pendingVerifications
        ]);
    }
}
