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
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class CompanyController extends Controller
{
    public function create(Request $request): Response
    {
        $company = $request->company;
        $companySizes = CompanySizeEnum::options();
        $companyTypes = CompanyTypeEnum::options();

        return Inertia::render('auth/company-register', [
            'company_name' => $company,
            'companySizes' => $companySizes,
            'companyTypes' => $companyTypes
        ]);
    }

    public function store(StoreCompanyRequest $storeCompanyRequest)
    {
        $data =  $storeCompanyRequest->validated();
        $data['verification_status'] = VerificationStatusEnum::Pending->value;
        if ($data['company_logo']) {
            $data['company_logo'] = asset(Storage::url($data['company_logo']));
        }
        $company = Company::create($data);
        $employer = Auth::user()->employer;
        $employer->company_id = $company->id;
        $employer->save();
        event(new EmployerRegisteredEvent($employer));

        return to_route('employer.create.company.pending')->with('success', 'Company registered successfully');
    }
    public function uploadLogo(Request $request)
    {
        if ($request->hasFile('file')) {
            $path = $request->file('file')->store('company/logos', 'public');
            return response()->json(['url' => $path]);
        }

        return response()->json(['error' => 'No file uploaded'], 400);
    }

    public function removeLogo(Request $request)
    {
        $fileUrl = $request->input('fileUrl');

        if (Storage::disk('public')->exists($fileUrl)) {
            Storage::disk('public')->delete($fileUrl);
            return response()->json(['message' => 'File deleted']);
        }
        return response()->json(['message' => 'File not found'], 404);
    }
}
