<?php

namespace App\Http\Controllers;

use App\Enums\CurrencyEnum;
use App\Enums\EmploymentTypeEnum;
use App\Enums\OperationsEnum;
use App\Enums\SalaryUnitEnum;
use App\Enums\WorkModelEnum;
use App\Http\Requests\JobPosting\StoreJobPostingRequest;
use App\Models\JobPosting;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class JobPostingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $jobs = JobPosting::latest()->get();
        return Inertia::render('employer/jobs/jobs-listing', [
            'jobs' => $jobs
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $operation = OperationsEnum::Create;
        $employementTypes = EmploymentTypeEnum::options();
        $workModel = WorkModelEnum::options();
        $salaryUnits = SalaryUnitEnum::options();
        $currencies = CurrencyEnum::options();

        return Inertia::render('employer/jobs/create-or-edit-job', [
            'operation' => $operation->value,
            'operationLabel' => $operation->label(),
            'employementTypes' => $employementTypes,
            'workModel' => $workModel,
            'salaryUnits' => $salaryUnits,
            'currencies' => $currencies
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreJobPostingRequest $storeJobPostingRequest)
    {
        $data = $storeJobPostingRequest->validated();
        dd($data);
    }

    /**
     * Display the specified resource.
     */
    public function show(JobPosting $jobPosting)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(JobPosting $jobPosting)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, JobPosting $jobPosting)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(JobPosting $jobPosting)
    {
        //
    }
}
