<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Enums\OperationsEnum;
use App\Http\Controllers\Controller;
use App\Models\OpeningTitle;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

final class OpeningTitleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $job_titles = OpeningTitle::query()
            ->when(
                $request->search,
                fn($q) =>
                $q->where('name', 'like', '%' . $request->search . '%')
            )
            ->paginate($request->perPage ?? 10)
            ->withQueryString();

        return Inertia::render('admin/job-titles/job-titles-listing', [
            'jobTitles' => $job_titles,
            'filters' => $request->only('search', 'perPage')
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
            'operationLabel' => $operation->label(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name' => 'required|string|max:255|unique:opening_titles,name',
        ]);

        OpeningTitle::create($data);

        return to_route('admin.job-titles.index')->with('success', 'Job title record created successfully');
    }

    /**
     * Display the specified resource.
     */
    public function show(OpeningTitle $jobTitle): void
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(OpeningTitle $jobTitle)
    {
        $operation = OperationsEnum::Edit;

        return Inertia::render('admin/job-titles/create-or-edit-job-title', [
            'job_title' => $jobTitle,
            'operation' => $operation->value,
            'operationLabel' => $operation->label(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, OpeningTitle $jobTitle)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255|unique:opening_titles,name,' . $jobTitle->id,
        ]);

        $jobTitle->update($data);

        return to_route('admin.job-titles.index')->with('success', 'Job title record updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(OpeningTitle $jobTitle)
    {
        $jobTitle->delete();

        return to_route('admin.job-titles.index')->with('success', 'Job title record deleted successfully');
    }
}
