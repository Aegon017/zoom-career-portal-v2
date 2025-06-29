<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Enums\OperationsEnum;
use App\Http\Controllers\Controller;
use App\Models\Industry;
use Illuminate\Http\Request;
use Inertia\Inertia;

final class IndustryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $industries = Industry::orderBy('name')->get();

        return Inertia::render('admin/industries/industries-listing', [
            'industries' => $industries,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $operation = OperationsEnum::Create;

        return Inertia::render('admin/industries/create-or-edit-industry', [
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
            'name' => 'required|string|unique:industries,name',
        ]);

        Industry::create($data);

        return redirect()->route('admin.industries.index')->with('success', 'Industry record created successfully.');
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
    public function edit(Industry $industry)
    {
        $operation = OperationsEnum::Edit;

        return Inertia::render('admin/industries/create-or-edit-industry', [
            'industry' => $industry,
            'operation' => $operation->value,
            'operationLabel' => $operation->label(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Industry $industry)
    {
        $data = $request->validate([
            'name' => 'required|string|unique:industries,name,'.$industry->id,
        ]);

        $industry->update($data);

        return redirect()->route('admin.industries.index')->with('success', 'Industry record updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Industry $industry)
    {
        $industry->delete();

        return to_route('admin.industries.index')->with('success', 'Industry record deleted successfully.');
    }
}
