<?php

namespace App\Http\Controllers;

use App\Enums\CurrencyEnum;
use App\Enums\EmploymentTypeEnum;
use App\Enums\JobStatusEnum;
use App\Enums\OperationsEnum;
use App\Enums\SalaryUnitEnum;
use App\Enums\VerificationStatusEnum;
use App\Enums\WorkModelEnum;
use App\Http\Requests\JobPosting\StoreJobPostingRequest;
use App\Http\Requests\JobPosting\UpdateJobPostingRequest;
use App\Http\Resources\SkillResource;
use App\Models\JobPosting;
use App\Models\JobPostingSkill;
use App\Models\Skill;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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
    public function create(): Response
    {
        $operation = OperationsEnum::Create;
        $employementTypes = EmploymentTypeEnum::options();
        $workModel = WorkModelEnum::options();
        $salaryUnits = SalaryUnitEnum::options();
        $currencies = CurrencyEnum::options();
        $jobStatuses = JobStatusEnum::options();
        $skills = SkillResource::collection(Skill::get());

        return Inertia::render('employer/jobs/create-or-edit-job', [
            'operation' => $operation->value,
            'operationLabel' => $operation->label(),
            'employementTypes' => $employementTypes,
            'workModel' => $workModel,
            'salaryUnits' => $salaryUnits,
            'currencies' => $currencies,
            'jobStatuses' => $jobStatuses,
            'skills' => $skills
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreJobPostingRequest $storeJobPostingRequest): RedirectResponse
    {
        $data = $storeJobPostingRequest->validated();
        $user = Auth::user();
        $employer = $user->employer;
        if ($data['status'] === JobStatusEnum::Published->value) {
            $data['published_at'] = now();
        }
        $data['employer_id'] = $employer->id;
        $company = $employer->company()->latest()->first();
        $data['company_id'] = $company->id;
        $data['verification_status'] = VerificationStatusEnum::Pending->value;
        $jobPosting = JobPosting::create($data);
        $skills = $data['skills'];
        $jobPosting->skills()->attach($skills);
        return to_route('job-postings.edit', $jobPosting->id)->with('success', 'Job record created successfully');
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
        $operation = OperationsEnum::Edit;
        $employementTypes = EmploymentTypeEnum::options();
        $workModel = WorkModelEnum::options();
        $salaryUnits = SalaryUnitEnum::options();
        $currencies = CurrencyEnum::options();
        $jobStatuses = JobStatusEnum::options();
        $skills = SkillResource::collection(Skill::get());

        return Inertia::render('employer/jobs/create-or-edit-job', [
            'job' => $jobPosting->load('skills'),
            'operation' => $operation->value,
            'operationLabel' => $operation->label(),
            'employementTypes' => $employementTypes,
            'workModel' => $workModel,
            'salaryUnits' => $salaryUnits,
            'currencies' => $currencies,
            'jobStatuses' => $jobStatuses,
            'skills' => $skills
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateJobPostingRequest $updateJobPostingRequest, JobPosting $jobPosting)
    {
        $data = $updateJobPostingRequest->validated();
        if ($data['status'] === JobStatusEnum::Published->value) {
            $data['published_at'] = now();
        }
        $skills = $data['skills'];
        $jobPosting->skills()->sync($skills);
        $jobPosting->update($data);

        return back()->with('success', 'Job record updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(JobPosting $jobPosting)
    {
        $jobPosting->delete();

        return to_route('job-postings.index')->with('success', 'Job record deleted successfully ');
    }
}
