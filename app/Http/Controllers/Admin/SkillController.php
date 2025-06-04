<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Enums\OperationsEnum;
use App\Http\Controllers\Controller;
use App\Http\Requests\Skill\StoreSkillRequest;
use App\Http\Requests\Skill\UpdateSkillRequest;
use App\Http\Resources\SkillResource;
use App\Models\Skill;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

final class SkillController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $skills = SkillResource::collection(Skill::latest()->get());

        return Inertia::render('admin/skills/skills-listing', [
            'skills' => $skills,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        $operation = OperationsEnum::Create;

        return Inertia::render('admin/skills/create-or-edit-skill', [
            'operation' => $operation->value,
            'operationLabel' => $operation->label(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreSkillRequest $storeSkillRequest): RedirectResponse
    {
        $data = $storeSkillRequest->validated();
        $skill = Skill::create($data);

        $operation = OperationsEnum::Edit;

        return to_route('skills.edit', [
            'skill' => SkillResource::make($skill),
            'operation' => $operation->value,
            'operationLabel' => $operation->label(),
        ])->with('success', 'Skill record created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Skill $skill)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Skill $skill): Response
    {
        $operation = OperationsEnum::Edit;

        return Inertia::render('admin/skills/create-or-edit-skill', [
            'skill' => SkillResource::make($skill),
            'operation' => $operation->value,
            'operationLabel' => $operation->label(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateSkillRequest $updateSkillRequest, Skill $skill): RedirectResponse
    {
        $data = $updateSkillRequest->validated();

        $skill->update($data);

        return back()->with('success', 'Skill record updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Skill $skill)
    {
        $skill->delete();

        return to_route('skills.index')->with('success', 'Skill record delted successfully');
    }
}
