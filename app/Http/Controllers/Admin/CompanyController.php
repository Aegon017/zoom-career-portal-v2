<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Company;
use Illuminate\Http\Request;
use Inertia\Inertia;

final class CompanyController extends Controller
{
    public function index()
    {
        $companies = Company::latest()->get();

        return Inertia::render('admin/companies/companies-listing', [
            'companies' => $companies,
        ]);
    }

    public function show(Company $company)
    {
        return Inertia::render('admin/companies/view-company', [
            'company' => $company,
        ]);
    }

    public function update(Company $company, Request $request)
    {
        $company->verification_status = $request->verification_status;
        $company->save();

        return back()->with('success', 'Verification status updated successfully');
    }
}
