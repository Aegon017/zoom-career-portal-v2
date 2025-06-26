<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Enums\OperationsEnum;
use App\Http\Controllers\Controller;
use App\Models\JobType;
use Illuminate\Http\Request;
use Inertia\Inertia;

final class JobTypeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $jobTypes = JobType::orderBy('name')->get();

        return Inertia::render('admin/job-types/job-types-listing', [
            'jobTypes' => $jobTypes,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $operation = OperationsEnum::Create;

        return Inertia::render('admin/job-types/create-or-edit-job-type', [
            'operation' => $operation->value,
            'operationLabel' => $operation->label(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|unique:job_types,name',
        ]);

        JobType::create($data);

        return redirect()->route('admin.job-types.index')->with('success', 'Job type record created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): void
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(JobType $jobType)
    {
        $operation = OperationsEnum::Edit;

        return Inertia::render('admin/job-types/create-or-edit-job-type', [
            'jobType' => $jobType,
            'operation' => $operation->value,
            'operationLabel' => $operation->label(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, JobType $jobType)
    {
        $data = $request->validate([
            'name' => 'required|string|unique:job_types,name,'.$jobType->id,
        ]);

        $jobType->update($data);

        return redirect()->route('admin.job-types.index')->with('success', 'Job type record updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(JobType $jobType)
    {
        $jobType->delete();

        return to_route('admin.job-types.index')->with('success', 'Job type record deleted successfully.');
    }
}
