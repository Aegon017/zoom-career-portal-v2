<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Enums\OperationsEnum;
use App\Http\Requests\Role\CreateRoleRequest;
use App\Http\Requests\Role\UpdateRoleRequest;
use App\Models\User;
use App\Services\PermissionService;
use App\Services\RoleService;
use Exception;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role;

final class RoleController extends Controller
{
    public function __construct(public RoleService $roleService, public PermissionService $permissionService, public User $user) {}

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        Gate::authorize('view_any_role', $this->user);

        $roles = Role::query()
            ->with('permissions')
            ->when(
                $request->search,
                fn ($q) => $q->where('name', 'like', '%'.$request->search.'%')
            )
            ->paginate($request->perPage ?? 10)
            ->withQueryString();

        return Inertia::render('admin/roles/roles-listing', [
            'roles' => $roles,
            'filters' => $request->only('search', 'perPage'),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        Gate::authorize('create_role', $this->user);

        $permissions = $this->permissionService->getGroupedPermissions();
        $role = [];

        return Inertia::render('admin/roles/create-or-edit-role', [
            'role' => $role,
            'permissions' => $permissions,
            'operation' => OperationsEnum::Create->value,
            'operationLabel' => OperationsEnum::Create->label(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CreateRoleRequest $request): RedirectResponse
    {
        Gate::authorize('create_role', $this->user);

        try {
            $this->roleService->createRoleWithPermissions($request->validated());

            return to_route('admin.roles.index')->with('success', 'Role created successsfully!');
        } catch (Exception) {
            return to_route('admin.roles.index')->with('error', 'Failed to create role.');
        }
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
    public function edit(string $id): Response
    {
        Gate::authorize('update_role', $this->user);

        $permissions = $this->permissionService->getGroupedPermissions();
        $role = Role::with('permissions')->find($id);

        return Inertia::render('admin/roles/create-or-edit-role', [
            'role' => $role,
            'permissions' => $permissions,
            'operation' => OperationsEnum::Edit->value,
            'operationLabel' => OperationsEnum::Edit->label(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateRoleRequest $request, string $id): RedirectResponse
    {
        Gate::authorize('update_role', $this->user);

        try {
            $this->roleService->updateRoleWithPermissions($id, $request->validated());

            return back()->with('success', 'Role updated successsfully!');
        } catch (Exception) {
            return back()->with('error', 'Failed to update role.');
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): RedirectResponse
    {
        Gate::authorize('delete_role', $this->user);

        try {
            $this->roleService->deleteRole($id);

            return back()->with('success', 'Role deleted successsfully!');
        } catch (Exception) {
            return back()->with('error', 'Failed to delete role.');
        }
    }
}
