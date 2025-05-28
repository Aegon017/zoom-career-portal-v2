<?php

namespace App\Http\Controllers\Comapny;

use App\Enums\CompanySizeEnum;
use App\Enums\CompanyTypeEnum;
use App\Enums\VerificationStatusEnum;
use App\Events\EmployerRegisteredEvent;
use App\Http\Controllers\Controller;
use App\Http\Requests\Company\StoreCompanyRequest;
use App\Models\Company;
use App\Models\Employer;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Event;
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
        $employer = Auth::user()->employer;
        $employer->company_id = $company->id;
        $employer->update();

        event(new EmployerRegisteredEvent($employer));

        return to_route('dashboard')->with('success', 'Company registered successfully');
    }
}
