<?php

declare(strict_types=1);

namespace App\Http\Controllers\Employer;

use App\Enums\CompanySizeEnum;
use App\Enums\CompanyTypeEnum;
use App\Http\Controllers\Controller;
use App\Http\Requests\Company\StoreCompanyRequest;
use App\Models\Company;
use App\Models\CompanyUser;
use App\Models\Industry;
use App\Models\Location;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

final class CompanyController extends Controller
{
    public function index(): Response
    {
        $company = CompanyUser::where('user_id', Auth::id())->latest()->first()->company;

        return Inertia::render('employer/company', [
            'company' => $company->load('users'),
        ]);
    }

    public function edit(): Response
    {
        $company = CompanyUser::where('user_id', Auth::id())->latest()->first()->company;
        $industries = Industry::get()->map(fn ($industry): array => [
            'value' => $industry->id,
            'label' => $industry->name,
        ]);
        $locations = Location::get()->map(fn ($location): array => [
            'value' => $location->id,
            'label' => $location->full_name,
        ]);

        return Inertia::render('employer/edit-company', [
            'company' => $company->load('address'),
            'industries' => $industries,
            'locations' => $locations,
            'sizes' => CompanySizeEnum::options(),
            'types' => CompanyTypeEnum::options(),
        ]);
    }

    public function update(StoreCompanyRequest $request, Company $company)
    {
        $data = $request->validated();

        $company->update($data);

        $company->address()->update([
            'location_id' => $data['location_id'],
        ]);

        if (! empty($data['logo_url']) && Storage::disk('public')->exists($data['logo_url'])) {
            $company->addMedia(storage_path('app/public/'.$data['logo_url']))
                ->preservingOriginal()
                ->toMediaCollection('logos');
        }

        if (! empty($data['banner_url']) && Storage::disk('public')->exists($data['banner_url'])) {
            $company->addMedia(storage_path('app/public/'.$data['banner_url']))
                ->preservingOriginal()
                ->toMediaCollection('banners');
        }

        return redirect('/employer/company')->with('success', 'Company details updated successfully.');
    }
}
