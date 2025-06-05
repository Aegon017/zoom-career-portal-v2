<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Enums\OperationsEnum;
use App\Models\TalentProfile;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

final class TalentProfileController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $talent_profiles = TalentProfile::query()->orderBy('name')->get();

        return Inertia::render('admin/talent-profiles/talent-profiles-listing', [
            'talent_profiles' => $talent_profiles,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        $operation = OperationsEnum::Create;

        return Inertia::render('admin/talent-profiles/create-or-edit-talent-profile', [
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
            'name' => 'required|string|max:255|unique:talent_profiles,name',
        ]);

        $talent_profile = TalentProfile::create($data);

        return to_route('admin.talent-profiles.edit', [
            'talent_profile' => $talent_profile,
        ])->with('success', 'Talent profile record created successfully');
    }

    /**
     * Display the specified resource.
     */
    public function show(TalentProfile $talentProfile)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(TalentProfile $talentProfile): Response
    {
        $operation = OperationsEnum::Edit;

        return Inertia::render('admin/talent-profiles/create-or-edit-talent-profile', [
            'talent_profile' => $talentProfile,
            'operation' => $operation->value,
            'operationLabel' => $operation->label(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, TalentProfile $talentProfile)
    {
        $data = $request->validate([
            'name' => "required|string|max:255|unique:talent_profiles,name,{$talentProfile->id}",
        ]);

        $talentProfile->update($data);

        return back()->with('success', 'Talent profile record updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(TalentProfile $talentProfile)
    {
        $talentProfile->delete();

        return to_route('admin.talent-profiles.index')->with('success', 'Talent profile record delted successfully');
    }
}
