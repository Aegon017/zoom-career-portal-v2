<?php

namespace App\Http\Controllers\Comapny;

use App\Enums\CompanySizeEnum;
use App\Enums\CompanyTypeEnum;
use App\Enums\VerificationStatusEnum;
use App\Http\Controllers\Controller;
use App\Http\Requests\Company\StoreCompanyRequest;
use App\Models\Company;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class CompanyController extends Controller
{
    public function create(): Response
    {
        $companySizes = CompanySizeEnum::options();
        $companyTypes = CompanyTypeEnum::options();

        return Inertia::render('auth/company-register', [
            'companySizes' => $companySizes,
            'companyTypes' => $companyTypes
        ]);
    }

    public function store(StoreCompanyRequest $storeCompanyRequest)
    {
        $data =  $storeCompanyRequest->validated();
        $data['verification_status'] = VerificationStatusEnum::Pending->value;
        $company = Company::create($data);
        Auth::user()->employer()->update([
            "company_id" => $company->id
        ]);
        return to_route('dashboard')->with('success', 'Company registered successfully');
    }
}
