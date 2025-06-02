<?php

namespace App\Http\Controllers;

use App\Http\Requests\Auth\LoginRequest;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Session;
use Illuminate\Validation\ValidationException;
use Spatie\Permission\Models\Role;

class RemoteLoginController extends Controller
{
    public function login(LoginRequest $request)
    {
        $credentials = $request->safe()->only('email', 'password');

        if (Auth::attempt($credentials)) {
            return $this->handleSuccessfulLogin(Auth::user());
        }

        $remoteUser = DB::connection('remoteMysql')
            ->table('users')
            ->where('email', $credentials['email'])
            ->first();

        if ($remoteUser && Hash::check($credentials['password'], $remoteUser->password)) {
            $localUser = $this->syncRemoteUserToLocal($remoteUser, $credentials['password']);
            Auth::login($localUser);
            return $this->handleSuccessfulLogin($localUser);
        }

        throw ValidationException::withMessages([
            'email' => __('auth.failed'),
        ]);
    }

    private function handleSuccessfulLogin(User $user)
    {
        Session::regenerate();

        $isAdmin = $user->email === 'admin@zoomgroup.com';

        if ($user->jobseeker && !$isAdmin) {
            return redirect()->intended(route('jobseeker.explore', absolute: false));
        }

        return redirect()->intended(route('dashboard', absolute: false));
    }

    private function syncRemoteUserToLocal(object $remoteUser, string $plainPassword): User
    {
        $isAdmin = $remoteUser->email === 'admin@zoomgroup.com';

        $localUser = User::updateOrCreate(
            ['email' => $remoteUser->email],
            [
                'name' => $remoteUser->name,
                'password' => Hash::make($plainPassword),
            ]
        );

        if ($isAdmin) {
            $this->assignRoleIfNotExists($localUser, 'super_admin');
            $localUser->email_verified_at = now();
            $localUser->save();
        } else {
            $this->assignRoleIfNotExists($localUser, 'jobseeker');
            $localUser->jobseeker()->firstOrCreate(); // Avoid duplicate
            event(new Registered($localUser));
        }

        return $localUser;
    }

    private function assignRoleIfNotExists(User $user, string $role)
    {
        Role::firstOrCreate(['name' => $role]);

        if (!$user->hasRole($role)) {
            $user->assignRole($role);
        }
    }
}
