<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Company;
use Illuminate\Http\Request;
use Inertia\Inertia;

final class CompanyController extends Controller
{
    public function index(Request $request)
    {
        $companies = Company::query()
            ->when(
                $request->search,
                fn($q) =>
                $q->where('name', 'like', '%' . $request->search . '%')
            )
            ->paginate($request->perPage ?? 10)
            ->withQueryString();

        return Inertia::render('admin/companies/companies-listing', [
            'companies' => $companies,
            'filters' => $request->only('search', 'perPage')
        ]);
    }

    public function show(Company $company)
    {
        return Inertia::render('admin/companies/view-company', [
            'company' => $company->load('users'),
        ]);
    }

    public function update(Company $company, Request $request)
    {
        $company->verification_status = $request->verification_status;
        $company->save();

        return back()->with('success', 'Verification status updated successfully');
    }
}
