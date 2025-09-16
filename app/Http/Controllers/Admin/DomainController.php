<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Enums\OperationsEnum;
use App\Http\Controllers\Controller;
use App\Models\Domain;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

final class DomainController extends Controller
{
    public function __construct(private readonly User $user) {}

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        Gate::authorize('view_any_skill', $this->user);

        $domains = Domain::query()
            ->when(
                $request->search,
                fn ($q) => $q->where('name', 'like', '%'.$request->search.'%')
            )
            ->paginate($request->perPage ?? 10)
            ->withQueryString();

        return Inertia::render('admin/domains/domains-listing', [
            'data' => $domains,
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

        return Inertia::render('admin/domains/create-or-edit-domain', [
            'operation' => $operation->value,
            'operationLabel' => $operation->label(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        Gate::authorize('create_skill', $this->user);

        $data = $request->validate([
            'name' => 'required|string|max:255|unique:domains,name',
        ]);

        Domain::create($data);

        return to_route('admin.domains.index')->with('success', 'Domain created successfully');
    }

    /**
     * Display the specified resource.
     */
    public function show(Domain $domain): void
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Domain $domain): Response
    {
        Gate::authorize('update_skill', $this->user);

        $operation = OperationsEnum::Edit;

        return Inertia::render('admin/domains/create-or-edit-domain', [
            'domain' => $domain,
            'operation' => $operation->value,
            'operationLabel' => $operation->label(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Domain $domain): RedirectResponse
    {
        Gate::authorize('update_skill', $this->user);

        $data = $request->validate([
            'name' => 'required|string|max:255|unique:domains,name,'.$domain->id,
        ]);

        $domain->update($data);

        return to_route('admin.domains.index')->with('success', 'Domain updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Domain $domain): RedirectResponse
    {
        Gate::authorize('delete_skill', $this->user);

        $domain->delete();

        return to_route('admin.domains.index')->with('success', 'Domain deleted successfully');
    }

    public function skills(Domain $domain)
    {
        return response()->json(
            $domain->skills()->select('id', 'name')->get()
        );
    }
}
