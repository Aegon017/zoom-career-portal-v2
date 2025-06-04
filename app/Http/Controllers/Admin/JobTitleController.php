<?php

namespace App\Http\Controllers\Admin;

use App\Enums\OperationsEnum;
use App\Http\Controllers\Controller;
use App\Models\JobTitle;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class JobTitleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $job_titles = JobTitle::query()->orderBy('name')->get();

        return Inertia::render('admin/job-titles/job-titles-listing', [
            'job_titles' => $job_titles
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        $operation = OperationsEnum::Create;

        return Inertia::render('admin/job-titles/create-or-edit-job-title', [
            'operation' => $operation->value,
            'operationLabel' => $operation->label()
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name' => 'required|string|max:255|unique:job_titles,name'
        ]);

        $job_title = JobTitle::create($data);

        return to_route('admin.job-titles.edit', [
            'job_title' => $job_title,
        ])->with('success', 'Job title record created successfully');
    }

    /**
     * Display the specified resource.
     */
    public function show(JobTitle $jobTitle)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(JobTitle $jobTitle)
    {
        $operation = OperationsEnum::Edit;

        return Inertia::render('admin/job-titles/create-or-edit-job-title', [
            'job_title' => $jobTitle,
            'operation' => $operation->value,
            'operationLabel' => $operation->label()
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, JobTitle $jobTitle)
    {
        $data = $request->validate([
            'name' => "required|string|max:255|unique:job_titles,name,{$jobTitle->id}"
        ]);

        $jobTitle->update($data);

        return back()->with('success', 'Job title record updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(JobTitle $jobTitle)
    {
        $jobTitle->delete();

        return to_route('admin.job-titles.index')->with('success', 'Job title record deleted successfully');
    }
}
