<?php

namespace App\Http\Controllers\Admin;

use App\Enums\OperationsEnum;
use App\Http\Controllers\Controller;
use App\Http\Requests\User\StoreUserRequest;
use App\Http\Requests\User\UpdateUserRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Exception;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $users = UserResource::collection(User::latest()->get());

        return Inertia::render('admin/users/users-listing', [
            "users" => $users
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        $operation = OperationsEnum::Create;

        return Inertia::render('admin/users/create-or-edit-user', [
            'operation' => $operation->value,
            'operationLabel' => $operation->label()
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUserRequest $storeUserRequest): RedirectResponse
    {
        $data = $storeUserRequest->validated();
        $user = User::create($data);

        $operation = OperationsEnum::Edit;

        return to_route('users.edit', [
            'user' => UserResource::make($user),
            'operation' => $operation->value,
            'operationLabel' => $operation->label()
        ])->with('success', 'User record created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $user): Response
    {
        $operation = OperationsEnum::Edit;

        return Inertia::render('admin/users/create-or-edit-user', [
            'user' => UserResource::make($user),
            'operation' => $operation->value,
            'operationLabel' => $operation->label()
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUserRequest $updateUserRequest, User $user): RedirectResponse
    {
        $data = $updateUserRequest->validated();
        if (empty($data['password'])) {
            unset($data['password']);
        }
        try {
            $user->update($data);
        } catch (\Throwable $th) {
            return back()->with('error', 'Something went wrong. Please try again.');
        }
        return back()->with('success', 'User record updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user): RedirectResponse
    {
        try {
            $user->delete();
        } catch (\Throwable $th) {
            return back()->with('error', 'Something went wrong. Please try again.');
        }
        return to_route('users.index')->with('success', 'User record delted successfully');
    }
}
