<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role;

class StudentRegisterController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('auth/student-register');
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'phone' => 'nullable|string|max:15',
            'course_completed' => 'nullable|string|max:255',
            'student_id' => 'nullable|string|max:50',
            'completed_month' => 'nullable|string|max:20',
            'do_not_remember' => 'boolean',
        ]);

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'phone' => $data['phone'] ?? null,
        ]);

        $role = Role::firstOrCreate(
            ['name' => 'jobseeker'],
            ['guard_name' => 'web']
        );

        $user->assignRole($role);

        $user->profile()->create([
            'course_completed' => $data['course_completed'] ?? null,
            'student_id' => $data['student_id'] ?? null,
            'completed_month' => $data['completed_month'] ?? null,
            'do_not_remember' => $data['do_not_remember'] ?? false,
            'is_verified' => false,
        ]);

        Auth::login($user);

        event(new Registered($user));

        return to_route('jobseeker.explore.index')->with('status', 'Registration successful. Please verify your email.');
    }
}
