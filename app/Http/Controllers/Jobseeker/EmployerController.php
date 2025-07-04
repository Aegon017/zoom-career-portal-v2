<?php

declare(strict_types=1);

namespace App\Http\Controllers\Jobseeker;

use App\Http\Controllers\Controller;
use App\Models\Company;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

final class EmployerController extends Controller
{
    public function index(Request $request)
    {
        Auth::user();

        $query = Company::with('industry', 'address', 'address.location');

        if ($request->filled('keyword')) {
            $query->where('name', 'like', '%'.$request->keyword.'%');
        }

        if ($request->filled('industries')) {
            $query->whereHas(
                'industry',
                fn ($q) => $q->whereIn('name', (array) $request->industries)
            );
        }

        if ($request->filled('locations')) {
            $query->whereHas(
                'address.location',
                fn ($q) => $q->whereIn('city', (array) $request->locations)
            );
        }

        if ($request->filled('sizes')) {
            $query->whereIn('size', (array) $request->sizes);
        }

        if ($request->boolean('followed') && Auth::check()) {
            $query->whereHas('followers', fn ($q) => $q->where('users.id', Auth::id()));
        }

        $companies = $query->paginate(10)->withQueryString();

        return Inertia::render('jobseeker/employers', [
            'companies' => $companies,
            'filters' => $request->only(['keyword', 'industries', 'locations', 'sizes', 'followed']),
        ]);
    }

    public function show(Company $company)
    {
        $company = $company->load('openings', 'users', 'openings.company', 'users.workExperiences', 'users.profile', 'industry', 'address', 'address.location');

        return Inertia::render('jobseeker/employer-details', [
            'company' => $company,
        ]);
    }
}
