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
    public function index(Request $request)
    {
        $industries = Industry::query()
            ->when(
                $request->search,
                fn ($q) => $q->where('name', 'like', '%'.$request->search.'%')
            )
            ->paginate($request->perPage ?? 10)
            ->withQueryString();

        return Inertia::render('admin/industries/industries-listing', [
            'industries' => $industries,
            'filters' => $request->only('search', 'perPage'),
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

    public function search(Request $request)
    {
        $search = $request->query('search');

        $industries = Industry::when($search, function ($query, $search): void {
            $query->where('name', 'like', sprintf('%%%s%%', $search));
        })
            ->limit(20)
            ->get([
                'id as value',
                'name as label',
            ]);

        return response()->json($industries);
    }
}
