<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Enums\JobApplicationStatusEnum;
use App\Enums\JobStatusEnum;
use App\Http\Controllers\Controller;
use App\Models\Company;
use App\Models\Opening;
use App\Models\OpeningApplication;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

final class DashboardController extends Controller
{
    public function index(): Response
    {
        $noOfStudents = User::role('jobseeker')->count();
        $noOfRecruiters = User::role('employer')->count();
        $noOfCompanies = Company::count();
        $noOfJobs = Opening::count();
        $noOfActiveJobs = Opening::where('status', JobStatusEnum::Published->value)->count();
        $noOfClosedJobs = Opening::where('status', JobStatusEnum::Closed->value)->count();
        $noOfActiveApplicants = OpeningApplication::where('status', JobApplicationStatusEnum::Applied->value)
            ->whereHas('opening', function ($query) {
                $query->where('status', JobStatusEnum::Published->value);
            })
            ->count();
        $noOfShortlistedApplicants = OpeningApplication::where('status', JobApplicationStatusEnum::Shortlisted->value)
            ->whereHas('opening', function ($query) {
                $query->where('status', JobStatusEnum::Published->value);
            })
            ->count();
        $noOfHiredApplicants = OpeningApplication::where('status', JobApplicationStatusEnum::Hired->value)
            ->whereHas('opening', function ($query) {
                $query->where('status', JobStatusEnum::Published->value);
            })
            ->count();

        return Inertia::render('admin/dashboard', [
            'noOfStudents' => $noOfStudents,
            'noOfRecruiters' => $noOfRecruiters,
            'noOfCompanies' => $noOfCompanies,
            'noOfJobs' => $noOfJobs,
            'noOfActiveJobs' => $noOfActiveJobs,
            'noOfClosedJobs' => $noOfClosedJobs,
            'noOfActiveApplicants' => $noOfActiveApplicants,
            'noOfShortlistedApplicants' => $noOfShortlistedApplicants,
            'noOfHiredApplicants' => $noOfHiredApplicants,
        ]);
    }
}
