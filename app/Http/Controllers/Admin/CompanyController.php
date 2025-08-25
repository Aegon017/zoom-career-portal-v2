<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Enums\CompanySizeEnum;
use App\Enums\CompanyTypeEnum;
use App\Enums\OperationsEnum;
use App\Enums\VerificationStatusEnum;
use App\Exports\EmployerExport;
use App\Http\Controllers\Controller;
use App\Models\Company;
use App\Models\Industry;
use App\Models\Location;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
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

    public function create()
    {
        $operation = OperationsEnum::Create;
        $industries = Industry::take(10)->get()->map(fn ($industry): array => [
            'value' => $industry->id,
            'label' => $industry->name,
        ]);

        $locations = Location::take(10)->get()->map(fn ($location): array => [
            'value' => $location->id,
            'label' => $location->full_name,
        ]);

        return Inertia::render('admin/companies/create-or-edit-company', [
            'operation' => $operation->value,
            'operationLabel' => $operation->label(),
            'sizes' => CompanySizeEnum::options(),
            'types' => CompanyTypeEnum::options(),
            'industries' => $industries,
            'locations' => $locations,
            'statusOptions' => VerificationStatusEnum::options(),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'logo_url' => 'nullable|string|max:255',
            'banner_url' => 'nullable|string|max:255',
            'website_url' => 'required|url|max:255',
            'description' => 'required|string',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:20',
            'size' => 'required|in:'.implode(',', CompanySizeEnum::values()),
            'type' => 'required|in:'.implode(',', CompanyTypeEnum::values()),
            'industry_id' => 'required|exists:industries,id',
            'location_id' => 'required|exists:locations,id',
            'verification_status' => 'required|in:'.implode(',', VerificationStatusEnum::values()),
        ]);

        $company = Company::create($data);

        $company->address()->create([
            'location_id' => $data['location_id'],
        ]);

        if (! empty($data['logo_url']) && Storage::exists($data['logo_url'])) {
            $company->addMedia(storage_path('app/public/'.$data['logo_url']))
                ->preservingOriginal()
                ->toMediaCollection('logos');
        }

        if (! empty($data['banner_url']) && Storage::exists($data['banner_url'])) {
            $company->addMedia(storage_path('app/public/'.$data['banner_url']))
                ->preservingOriginal()
                ->toMediaCollection('banners');
        }

        return redirect()->route('admin.companies.index')
            ->with('success', 'Company created successfully.');
    }

    public function show(Company $company)
    {
        $company->load(['users', 'industry', 'address.location']);

        return Inertia::render('admin/companies/view-company', [
            'company' => $company,
        ]);
    }

    public function edit(Company $company)
    {
        $company->load(['industry', 'address.location']);
        $operation = OperationsEnum::Edit;
        $industries = Industry::when($company->industry_id, function ($query) use ($company): void {
            $query->where('id', '!=', $company->industry_id);
        })
            ->take(10)
            ->get()
            ->map(fn ($industry): array => [
                'value' => $industry->id,
                'label' => $industry->name,
            ]);

        $locations = Location::when($company->address && $company->address->location_id, function ($query) use ($company): void {
            $query->where('id', '!=', $company->address->location_id);
        })
            ->take(10)
            ->get()
            ->map(fn ($location): array => [
                'value' => $location->id,
                'label' => $location->full_name,
            ]);

        if ($company->industry_id) {
            $companyIndustry = $company->industry ?? Industry::find($company->industry_id);
            if ($companyIndustry) {
                $industries->prepend([
                    'value' => $companyIndustry->id,
                    'label' => $companyIndustry->name,
                ]);
            }
        }

        if ($company->address && $company->address->location_id) {
            $companyLocation = $company->address->location ?? Location::find($company->address->location_id);
            if ($companyLocation) {
                $locations->prepend([
                    'value' => $companyLocation->id,
                    'label' => $companyLocation->full_name,
                ]);
            }
        }

        return Inertia::render('admin/companies/create-or-edit-company', [
            'company' => $company,
            'operation' => $operation->value,
            'operationLabel' => $operation->label(),
            'sizes' => CompanySizeEnum::options(),
            'types' => CompanyTypeEnum::options(),
            'industries' => $industries,
            'locations' => $locations,
            'statusOptions' => VerificationStatusEnum::options(),
        ]);
    }

    public function update(Request $request, Company $company)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'logo_url' => 'nullable|string|max:255',
            'banner_url' => 'nullable|string|max:255',
            'website_url' => 'required|url|max:255',
            'description' => 'required|string',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:20',
            'size' => 'required|in:'.implode(',', CompanySizeEnum::values()),
            'type' => 'required|in:'.implode(',', CompanyTypeEnum::values()),
            'industry_id' => 'required|exists:industries,id',
            'location_id' => 'required|exists:locations,id',
            'verification_status' => 'required|in:'.implode(',', VerificationStatusEnum::values()),
        ]);

        $company->update($data);

        $company->address()->update(['location_id' => $data['location_id']]);

        if (! empty($data['logo_url']) && Storage::exists($data['logo_url'])) {
            $company->addMedia(storage_path('app/public/'.$data['logo_url']))
                ->preservingOriginal()
                ->toMediaCollection('logos');
        }

        if (! empty($data['banner_url']) && Storage::exists($data['banner_url'])) {
            $company->addMedia(storage_path('app/public/'.$data['banner_url']))
                ->preservingOriginal()
                ->toMediaCollection('banners');
        }

        return redirect()->route('admin.companies.index')
            ->with('success', 'Company updated successfully.');
    }

    public function destroy(Company $company)
    {
        $company->delete();

        return redirect()->route('admin.companies.index')
            ->with('success', 'Company deleted successfully.');
    }

    public function updateStatus(Company $company, Request $request)
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
