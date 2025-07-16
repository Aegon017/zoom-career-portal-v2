<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Session;
use Illuminate\Validation\ValidationException;
use Spatie\Permission\Models\Role;

final class RemoteLoginController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        if (Auth::attempt($credentials)) {
            $user = Auth::user();
            Session::regenerate();

            if ($user->hasRole('jobseeker')) {
                $this->registerJobseekerProfile($user, $request);
            }

            return redirect($this->redirectToDashboard($user));
        }

        $remote_user = DB::connection('remote_mysql')
            ->table('users')
            ->where('email', $credentials['email'])
            ->leftJoin('model_has_roles', 'users.id', '=', 'model_has_roles.model_id')
            ->leftJoin('roles', 'model_has_roles.role_id', '=', 'roles.id')
            ->select('users.*', 'roles.name as role_name')
            ->first();

        if ($remote_user && Hash::check($credentials['password'], $remote_user->password)) {
            $role_name = $remote_user->role_name;
            if ($role_name !== 'super_admin') {
                $role_name = 'jobseeker';
            }

            $role = Role::findOrCreate($role_name);
            $user = $this->saveUser($remote_user);
            $user->assignRole($role);
            Auth::login($user);
            Session::regenerate();

            if ($role_name === 'jobseeker') {
                $this->registerJobseekerProfile($user, $request);
            }

            return redirect($this->redirectToDashboard($user));
        }

        throw ValidationException::withMessages([
            'email' => __('auth.failed'),
        ]);
    }

    private function registerJobseekerProfile(User $user, Request $request): void
    {
        $validated = $request->validate([
            'phone' => 'nullable|string|max:15',
            'course_completed' => 'nullable|string|max:255',
            'student_id' => 'nullable|string|max:50',
            'completed_month' => 'nullable|date_format:Y-m',
            'do_not_remember' => 'boolean',
        ]);

        $user->phone = $validated['phone'] ?? $user->phone;
        $user->save();

        $user->profile()->updateOrCreate(
            ['user_id' => $user->id],
            [
                'course_completed' => $validated['course_completed'] ?? null,
                'student_id' => $validated['student_id'] ?? null,
                'completed_month' => $validated['completed_month'] ?? null,
                'do_not_remember' => $validated['do_not_remember'] ?? false,
            ]
        );
    }

    private function saveUser($user)
    {
        return User::updateOrCreate(
            ['email' => $user->email],
            [
                'name' => $user->name,
                'password' => $user->password,
                'email_verified_at' => $user->email_verified_at,
            ]
        );
    }

    private function redirectToDashboard(User $user)
    {
        $role = $user->getRoleNames()->first();

        return match ($role) {
            'super_admin' => route('admin.dashboard'),
            'jobseeker' => route('jobseeker.explore.index'),
            'employer' => route('employer.dashboard'),
            default => '/',
        };
    }
}
