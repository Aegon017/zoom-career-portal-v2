<?php

declare(strict_types=1);

namespace App\Http\Controllers\Jobseeker;

use App\Http\Controllers\Controller;
use App\Models\Company;
use Inertia\Inertia;

final class EmployerController extends Controller
{
    public function index()
    {
        $companies = Company::query()->get();

        return Inertia::render('jobseeker/employers', [
            'companies' => $companies,
        ]);
    }

    public function show(Company $company)
    {
        $company = $company->load('openings', 'users', 'openings.company', 'users.workExperiences', 'users.jobSeekerProfile');

        return Inertia::render('jobseeker/employer-details', [
            'company' => $company,
        ]);
    }
}
