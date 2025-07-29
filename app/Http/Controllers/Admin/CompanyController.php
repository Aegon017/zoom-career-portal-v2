<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Exports\EmployerExport;
use App\Http\Controllers\Controller;
use App\Models\Company;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

final class CompanyController extends Controller
{
    public function index(Request $request)
    {
        $companies = Company::query()
            ->when(
                $request->search,
                fn ($q) => $q->where('name', 'like', '%'.$request->search.'%')
            )
            ->paginate($request->perPage ?? 10)
            ->withQueryString();

        return Inertia::render('admin/companies/companies-listing', [
            'companies' => $companies,
            'filters' => $request->only('search', 'perPage'),
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

    public function search(Request $request)
    {
        $searchTerm = $request->input('search', '');

        if (empty($searchTerm)) {
            return response()->json([]);
        }

        $companies = Company::query()
            ->where('name', 'LIKE', '%'.$searchTerm.'%')
            ->limit(10)
            ->get(['id', 'name']);

        return response()->json($companies);
    }

    public function export()
    {
        return Excel::download(new EmployerExport, 'companies.xlsx');
    }
}
