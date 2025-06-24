<?php

namespace App\Http\Controllers\Admin;

use App\Enums\OperationsEnum;
use App\Http\Controllers\Controller;
use App\Models\Location;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class LocationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $locations = Location::take(10000)->get();

        return Inertia::render('admin/locations/locations-listing', [
            'locations' => $locations
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $operation = OperationsEnum::Create;

        return Inertia::render('admin/locations/create-or-edit-location', [
            'operation' => $operation->value,
            'operationLabel' => $operation->label()
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */

    public function store(Request $request)
    {
        $data = $request->validate([
            'city'  => ['required', 'string', 'max:255'],
            'state' => ['nullable', 'string', 'max:255'],
            'country'   => ['required', 'string', 'max:255'],

            Rule::unique('locations')->where(
                fn($query) =>
                $query->where('city', $request->city)
                    ->where('state', $request->state)
            ),
        ], [
            'unique' => 'This city and state combination already exists.',
        ]);

        Location::create($data);

        return to_route('admin.locations.index')->with('success', 'Location record created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Location $location)
    {
        $operation = OperationsEnum::Edit;

        return Inertia::render('admin/locations/create-or-edit-location', [
            'location' => $location,
            'operation' => $operation->value,
            'operationLabel' => $operation->label()
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Location $location)
    {
        $data = $request->validate([
            'city'  => ['required', 'string', 'max:255'],
            'state' => ['nullable', 'string', 'max:255'],
            'country'   => ['required', 'string', 'max:20'],
            'city' => [
                'required',
                'string',
                'max:255',
                Rule::unique('locations')
                    ->where(fn($query) => $query->where('state', $request->state))
                    ->ignore($location->id)
            ],
        ], [
            'city.unique' => 'This city + state combination already exists.',
        ]);

        $location->update($data);

        return to_route('admin.locations.index')->with('success', 'Location record updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Location $location)
    {
        $location->delete();

        return to_route('admin.locations.index')->with('success', 'Location record deleted successfully.');
    }
}
