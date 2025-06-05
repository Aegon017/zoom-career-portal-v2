<?php

namespace App\Http\Controllers\Employer;

use App\Enums\CurrencyEnum;
use App\Enums\EmploymentTypeEnum;
use App\Enums\JobStatusEnum;
use App\Enums\OperationsEnum;
use App\Enums\SalaryUnitEnum;
use App\Enums\VerificationStatusEnum;
use App\Enums\WorkModelEnum;
use App\Http\Controllers\Controller;
use App\Http\Requests\CreateOpeningRequest;
use App\Http\Requests\EditOpeningRequest;
use App\Http\Requests\Opening\StoreOpeningRequest;
use App\Http\Resources\SkillResource;
use App\Models\Opening;
use App\Models\Skill;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class OpeningController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $jobs = Opening::where('user_id', Auth::id())->latest()->get();

        return Inertia::render('employer/jobs/jobs-listing', [
            'jobs' => $jobs,
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
        $skills = SkillResource::collection(Skill::query()->orderBy('name')->get());

        return Inertia::render('employer/jobs/create-or-edit-job', [
            'operation' => $operation->value,
            'operationLabel' => $operation->label(),
            'employementTypes' => $employementTypes,
            'workModel' => $workModel,
            'salaryUnits' => $salaryUnits,
            'currencies' => $currencies,
            'jobStatuses' => $jobStatuses,
            'skills' => $skills,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CreateOpeningRequest $createOpeningRequest): RedirectResponse
    {
        $data = $createOpeningRequest->validated();
        $user = Auth::user();
        if ($data['status'] === JobStatusEnum::Published->value) {
            $data['published_at'] = now();
        }
        $data['user_id'] = $user->id;
        $company = $user->companies()->latest()->first();
        $data['company_id'] = $company->id;
        $data['verification_status'] = VerificationStatusEnum::Pending->value;
        $job = Opening::create($data);
        $skills = array_column($data['skills'], 'id');
        $job->skills()->sync($skills);

        return to_route('employer.jobs.edit', $job->id)->with('success', 'Job record created successfully');
    }

    /**
     * Display the specified resource.
     */
    public function show(Opening $job)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Opening $job)
    {
        $operation = OperationsEnum::Edit;
        $employementTypes = EmploymentTypeEnum::options();
        $workModel = WorkModelEnum::options();
        $salaryUnits = SalaryUnitEnum::options();
        $currencies = CurrencyEnum::options();
        $jobStatuses = JobStatusEnum::options();
        $skills = SkillResource::collection(Skill::get());

        return Inertia::render('employer/jobs/create-or-edit-job', [
            'job' => $job->load('skills'),
            'operation' => $operation->value,
            'operationLabel' => $operation->label(),
            'employementTypes' => $employementTypes,
            'workModel' => $workModel,
            'salaryUnits' => $salaryUnits,
            'currencies' => $currencies,
            'jobStatuses' => $jobStatuses,
            'skills' => $skills,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(EditOpeningRequest $editOpeningRequest, Opening $job)
    {
        $data = $editOpeningRequest->validated();

        $job->update($data);

        if ($job->status !== JobStatusEnum::Published->value && $data['status'] === JobStatusEnum::Published->value) {
            $job->published_at = now();
            $job->save();
        }

        $skills = array_column($data['skills'], 'id');
        $job->skills()->sync($skills);

        return back()->with('success', 'Job record updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Opening $job)
    {
        $job->delete();

        return to_route('employer.jobs.index')->with('success', 'Job record deleted successfully ');
    }
}
