<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Enums\OperationsEnum;
use App\Http\Controllers\Controller;
use App\Models\JobFunction;
use Illuminate\Http\Request;
use Inertia\Inertia;

final class JobFunctionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $jobFunctions = JobFunction::orderBy('name')->get();

        return Inertia::render('admin/job-functions/job-functions-listing', [
            'jobFunctions' => $jobFunctions,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $operation = OperationsEnum::Create;

        return Inertia::render('admin/job-functions/create-or-edit-job-function', [
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
            'name' => 'required|string|unique:job_functions,name',
        ]);

        JobFunction::create($data);

        return redirect()->route('admin.job-functions.index')->with('success', 'Job function record created successfully.');
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
    public function edit(JobFunction $jobFunction)
    {
        $operation = OperationsEnum::Edit;

        return Inertia::render('admin/job-functions/create-or-edit-job-function', [
            'jobFunction' => $jobFunction,
            'operation' => $operation->value,
            'operationLabel' => $operation->label(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, JobFunction $jobFunction)
    {
        $data = $request->validate([
            'name' => 'required|string|unique:job_functions,name,'.$jobFunction->id,
        ]);

        $jobFunction->update($data);

        return redirect()->route('admin.job-functions.index')->with('success', 'Job function record updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(JobFunction $jobFunction)
    {
        $jobFunction->delete();

        return to_route('admin.job-functions.index')->with('success', 'Job function record deleted successfully.');
    }
}
