<?php

declare(strict_types=1);

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
use App\Mail\Admin\JobVerifyMail;
use App\Mail\Employer\JobVerificationStatusMail;
use App\Models\Opening;
use App\Models\Skill;
use App\Models\User;
use App\Notifications\JobPostedNotification;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Notification;
use Inertia\Inertia;
use Inertia\Response;

final class OpeningController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $jobs = Opening::query()
            ->when(
                $request->search,
                fn ($q) => $q->where('title', 'like', '%'.$request->search.'%')
            )
            ->where('user_id', Auth::id())
            ->paginate($request->perPage ?? 10)
            ->withQueryString();

        return Inertia::render('employer/jobs/jobs-listing', [
            'jobs' => $jobs,
            'filters' => $request->only('search', 'perPage'),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        $operation = OperationsEnum::Create;
        $employmentTypeOptions = EmploymentTypeEnum::options();
        $workModelOptions = WorkModelEnum::options();
        $salaryUnitOptions = SalaryUnitEnum::options();
        $currencyOptions = CurrencyEnum::options();
        $jobStatusOptions = JobStatusEnum::options();

        $skillOptions = Skill::get()->map(fn ($skill): array => [
            'value' => $skill->id,
            'label' => $skill->name,
        ])->toArray();

        return Inertia::render('employer/jobs/create-or-edit-job', [
            'operation' => $operation->value,
            'operationLabel' => $operation->label(),
            'employmentTypeOptions' => $employmentTypeOptions,
            'workModelOptions' => $workModelOptions,
            'salaryUnitOptions' => $salaryUnitOptions,
            'currencyOptions' => $currencyOptions,
            'jobStatusOptions' => $jobStatusOptions,
            'skillOptions' => $skillOptions,
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
        $job->skills()->sync($data['skills']);
        $job->address()->create([
            'location_id' => $data['location_id'],
        ]);

        $this->sendNotification($job->user, $job);

        return to_route('employer.jobs.index')->with('success', 'Job record created successfully');
    }

    /**
     * Display the specified resource.
     */
    public function show(Opening $job): void
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Opening $job)
    {
        $operation = OperationsEnum::Edit;
        $employmentTypeOptions = EmploymentTypeEnum::options();
        $workModelOptions = WorkModelEnum::options();
        $salaryUnitOptions = SalaryUnitEnum::options();
        $currencyOptions = CurrencyEnum::options();
        $jobStatusOptions = JobStatusEnum::options();

        $skillOptions = Skill::get()->map(fn ($skill): array => [
            'value' => $skill->id,
            'label' => $skill->name,
        ])->toArray();

        return Inertia::render('employer/jobs/create-or-edit-job', [
            'job' => $job->load('skills', 'address', 'address.location', 'industry'),
            'operation' => $operation->value,
            'operationLabel' => $operation->label(),
            'employmentTypeOptions' => $employmentTypeOptions,
            'workModelOptions' => $workModelOptions,
            'salaryUnitOptions' => $salaryUnitOptions,
            'currencyOptions' => $currencyOptions,
            'jobStatusOptions' => $jobStatusOptions,
            'skillOptions' => $skillOptions,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(EditOpeningRequest $editOpeningRequest, Opening $job)
    {
        $data = $editOpeningRequest->validated();

        $job->update([
            ...$data,
            'verification_status' => VerificationStatusEnum::Pending->value,
        ]);

        if ($job->status !== JobStatusEnum::Published->value && $data['status'] === JobStatusEnum::Published->value) {
            $job->published_at = now();
            $job->save();
        }

        $job->skills()->sync($data['skills']);

        $job->address()->update([
            'location_id' => $data['location_id'],
        ]);

        $this->sendNotification($job->user, $job);

        return to_route('employer.jobs.index')->with('success', 'Job record updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Opening $job)
    {
        $job->delete();

        return to_route('employer.jobs.index')->with('success', 'Job record deleted successfully ');
    }

    private function sendNotification(User $user, Opening $opening): void
    {
        $admins = User::role('super_admin')->get();

        $company_name = $opening->company->name;
        $posted_by = $user->name;
        $job_title = $opening->title;
        $review_link = route('admin.job.verify', [
            'job' => $opening->id,
        ]);
        $status = $opening->verification_status;

        Mail::to($user)->send(new JobVerificationStatusMail($job_title, $status));

        foreach ($admins as $admin) {
            Mail::to($admin)->send(new JobVerifyMail($job_title, $company_name, $posted_by, $review_link));
        }

        Notification::send($admins, new JobPostedNotification($user, $opening));
    }
}
