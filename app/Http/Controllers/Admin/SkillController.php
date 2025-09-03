<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Enums\OperationsEnum;
use App\Http\Controllers\Controller;
use App\Http\Requests\Skill\StoreSkillRequest;
use App\Http\Requests\Skill\UpdateSkillRequest;
use App\Http\Resources\SkillResource;
use App\Models\Skill;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

final class SkillController extends Controller
{
    public function __construct(private readonly User $user) {}

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        Gate::authorize('view_any_skill', $this->user);

        $data = Skill::query()
            ->when(
                $request->search,
                fn ($q) => $q->where('name', 'like', '%'.$request->search.'%')
            )
            ->paginate($request->perPage ?? 10)
            ->withQueryString();

        return Inertia::render('admin/skills/skills-listing', [
            'data' => $data,
            'filters' => $request->only('search', 'perPage'),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        Gate::authorize('create_skill', $this->user);

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
        Gate::authorize('create_skill', $this->user);

        $data = $storeSkillRequest->validated();
        Skill::create($data);

        return to_route('admin.skills.index')->with('success', 'Skill record created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Skill $skill): void
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Skill $skill): Response
    {
        Gate::authorize('update_skill', $this->user);

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
        Gate::authorize('update_skill', $this->user);

        $data = $updateSkillRequest->validated();

        $skill->update($data);

        return to_route('admin.skills.index')->with('success', 'Skill record updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Skill $skill)
    {
        Gate::authorize('delete_skill', $this->user);

        $skill->delete();

        return to_route('admin.skills.index')->with('success', 'Skill record delted successfully');
    }

    public function search(Request $request)
    {
        $query = $request->input('search', '');

        $skills = Skill::where('name', 'like', '%'.$query.'%')
            ->orderBy('name')
            ->limit(20)
            ->get()
            ->map(fn ($skill): array => [
                'label' => $skill->name,
                'value' => $skill->name,
            ]);

        return response()->json($skills);
    }
}
