<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\Auth\LoginRequest;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Session;
use Illuminate\Validation\ValidationException;
use Spatie\Permission\Models\Role;

final class RemoteLoginController extends Controller
{
    public function login(LoginRequest $loginRequest)
    {
        $credentials = $loginRequest->safe()->only('email', 'password');

        if (Auth::attempt($credentials)) {
            Session::regenerate();

            return redirect($this->redirectToDashboard(Auth::user()));
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

            return redirect($this->redirectToDashboard($user));
        }

        throw ValidationException::withMessages([
            'email' => __('auth.failed'),
        ]);
    }

    private function saveUser($user)
    {
        return $user = User::updateOrCreate(
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
            'jobseeker' => route('jobseeker.explore'),
            'employer' => route('employer.dashboard'),
            default => '/'
        };
    }
}
