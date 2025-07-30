<?php

declare(strict_types=1);

namespace App\Http\Controllers\Employer;

use App\Enums\CompanySizeEnum;
use App\Enums\CompanyTypeEnum;
use App\Enums\OperationsEnum;
use App\Enums\VerificationStatusEnum;
use App\Http\Controllers\Controller;
use App\Http\Requests\Company\StoreCompanyRequest;
use App\Models\Company;
use App\Models\CompanyUser;
use App\Models\Industry;
use App\Models\Location;
use App\Models\User;
use App\Notifications\Admin\CompanyVerificationNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

final class CompanyController extends Controller
{
    public function index(): Response
    {
        $company = CompanyUser::where('user_id', Auth::id())->latest()->first()->company;

        return Inertia::render('employer/company', [
            'company' => $company->load(['users', 'industry', 'address.location']),
        ]);
    }

    public function edit(): Response
    {
        $company = Auth::user()->companies()->latest()->first();
        $company->load(['industry', 'address.location']);
        $operation = OperationsEnum::Edit;
        $industries = Industry::when($company->industry_id, function ($query) use ($company) {
            $query->where('id', '!=', $company->industry_id);
        })
            ->take(10)
            ->get()
            ->map(fn($industry) => [
                'value' => $industry->id,
                'label' => $industry->name,
            ]);

        $locations = Location::when($company->address && $company->address->location_id, function ($query) use ($company) {
            $query->where('id', '!=', $company->address->location_id);
        })
            ->take(10)
            ->get()
            ->map(fn($location) => [
                'value' => $location->id,
                'label' => $location->full_name,
            ]);

        if ($company->industry_id) {
            $companyIndustry = $company->industry ?? Industry::find($company->industry_id);
            if ($companyIndustry) {
                $industries->prepend([
                    'value' => $companyIndustry->id,
                    'label' => $companyIndustry->name
                ]);
            }
        }

        if ($company->address && $company->address->location_id) {
            $companyLocation = $company->address->location ?? Location::find($company->address->location_id);
            if ($companyLocation) {
                $locations->prepend([
                    'value' => $companyLocation->id,
                    'label' => $companyLocation->full_name
                ]);
            }
        }

        return Inertia::render('employer/edit-company', [
            'operation' => $operation->value,
            'operationLabel' => $operation->label(),
            'company' => $company->load('address'),
            'industries' => $industries,
            'locations' => $locations,
            'sizes' => CompanySizeEnum::options(),
            'types' => CompanyTypeEnum::options(),
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
            'size' => 'required|in:' . implode(',', CompanySizeEnum::values()),
            'type' => 'required|in:' . implode(',', CompanyTypeEnum::values()),
            'industry_id' => 'required|exists:industries,id',
            'location_id' => 'required|exists:locations,id',
        ]);

        $data['verification_status'] = VerificationStatusEnum::Pending->value;

        $company->update($data);

        $company->address()->update(['location_id' => $data['location_id']]);

        if (! empty($data['logo_url']) && Storage::exists($data['logo_url'])) {
            $company->addMedia(storage_path('app/public/' . $data['logo_url']))
                ->preservingOriginal()
                ->toMediaCollection('logos');
        }

        if (! empty($data['banner_url']) && Storage::exists($data['banner_url'])) {
            $company->addMedia(storage_path('app/public/' . $data['banner_url']))
                ->preservingOriginal()
                ->toMediaCollection('banners');
        }

        $admins = User::role('super_admin')->get();
        Notification::send($admins, new CompanyVerificationNotification($company));

        return redirect('/employer/company')->with('success', 'Company details updated successfully.');
    }
}
