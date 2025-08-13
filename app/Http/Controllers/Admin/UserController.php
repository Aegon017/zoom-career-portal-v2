<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Enums\OperationsEnum;
use App\Http\Controllers\Controller;
use App\Http\Requests\CreateUserRequest;
use App\Http\Requests\EditUserRequest;
use App\Http\Requests\UserRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role;

final class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $users = User::query()
            ->when(
                $request->search,
                fn($q) => $q->where('name', 'like', '%' . $request->search . '%')
                    ->orWhere('email', 'like', '%' . $request->search . '%')
            )
            ->paginate($request->perPage ?? 10)
            ->withQueryString();

        return Inertia::render('admin/users/users-listing', [
            'users' => $users,
            'filters' => $request->only('search', 'perPage'),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        $operation = OperationsEnum::Create;
        $roleOptions = Role::get()->map(function ($role) {
            return [
                'value' => $role->id,
                'label' => $role->name
            ];
        });

        return Inertia::render('admin/users/create-or-edit-user', [
            'roleOptions' => $roleOptions,
            'operation' => $operation->option()
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CreateUserRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $user = User::create($data);
        $user->syncRoles($data['roles']);

        return to_route('admin.users.index')->with('success', 'User record created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user): void
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $user): Response
    {
        $operation = OperationsEnum::Edit;
        $roleOptions = Role::get()->map(function ($role) {
            return [
                'value' => $role->id,
                'label' => $role->name
            ];
        });

        return Inertia::render('admin/users/create-or-edit-user', [
            'user' => UserResource::make($user)->load('roles'),
            'roleOptions' => $roleOptions,
            'operation' => $operation->option()
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(EditUserRequest $request, User $user): RedirectResponse
    {
        $data = $request->validated();
        if (empty($data['password'])) {
            unset($data['password']);
        }

        $user->update($data);

        $user->syncRoles($data['roles']);

        return to_route('admin.users.index')->with('success', 'User record updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user): RedirectResponse
    {
        $user->delete();

        return to_route('admin.users.index')->with('success', 'User record delted successfully');
    }
}
