<?php

declare(strict_types=1);

namespace App\Http\Controllers\auth;

use App\Events\EmployerRegistered;
use App\Http\Controllers\Controller;
use App\Http\Requests\RegisterEmployerRequest;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role;

final class RegisteredEmployerController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('auth/employer-register');
    }

    public function store(RegisterEmployerRequest $registerEmployerRequest)
    {
        $data = $registerEmployerRequest->validated();

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
        ]);

        $role = Role::findOrCreate('employer');

        $user->assignRole($role);
        EmployerRegistered::dispatch($user);
        event(new Registered($user));

        Auth::login($user);

        return to_route('employer.dashboard');
    }
}
