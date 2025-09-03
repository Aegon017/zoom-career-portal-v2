<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Enums\VerificationStatusEnum;
use App\Http\Controllers\Controller;
use App\Models\Company;
use App\Models\Opening;
use App\Models\User;
use Inertia\Inertia;

final class VerificationController extends Controller
{
    public function index()
    {
        $pendingCompanies = Company::where('verification_status', VerificationStatusEnum::Pending->value)->get();
        $pendingStudents = User::role('jobseeker')
            ->whereHas('profile', function ($query): void {
                $query->where('is_verified', false);
            })
            ->get();
        $pendingEmployers = User::role('employer')
            ->whereHas('companyUsers', function ($query): void {
                $query->where('verification_status', VerificationStatusEnum::Pending->value);
            })
            ->get();
        $pendingJobs = Opening::where('verification_status', VerificationStatusEnum::Pending->value)->get();

        return Inertia::render('admin/pending-verifications-listing', [
            'pendingVerifications' => [
                'company' => [
                    'count' => $pendingCompanies->count(),
                    'items' => $pendingCompanies->map(fn ($company): array => [
                        'id' => $company->id,
                        'message' => 'Company updated and needs verification: '.$company->name,
                        'url' => route('admin.companies.show', $company->id),
                    ]),
                ],
                'student' => [
                    'count' => $pendingStudents->count(),
                    'items' => $pendingStudents->map(fn ($user): array => [
                        'id' => $user->id,
                        'message' => 'Student profile needs verification: '.$user->name,
                        'url' => route('admin.students.show', $user->id),
                    ]),
                ],
                'employer' => [
                    'count' => $pendingEmployers->count(),
                    'items' => $pendingEmployers->map(fn ($user): array => [
                        'id' => $user->id,
                        'message' => 'Employer account needs verification: '.$user->name,
                        'url' => route('admin.recruiters.show', $user->id),
                    ]),
                ],
                'job' => [
                    'count' => $pendingJobs->count(),
                    'items' => $pendingJobs->map(fn ($job): array => [
                        'id' => $job->id,
                        'message' => 'Job opening pending verification: '.$job->title,
                        'url' => route('admin.jobs.show', $job->id),
                    ]),
                ],
            ],
        ]);
    }
}
