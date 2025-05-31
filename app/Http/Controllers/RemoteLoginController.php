<?php

namespace App\Http\Controllers;

use App\Http\Requests\Auth\LoginRequest;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Session;
use Illuminate\Validation\ValidationException;

class RemoteLoginController extends Controller
{
    public function login(LoginRequest $request)
    {
        $credentials = $request->safe()->only('email', 'password');
        if (Auth::attempt($credentials)) {
            Session::regenerate();
            return redirect()->intended(route('dashboard', absolute: false));
        }
        $remoteUser = DB::connection('remoteMysql')->table('users')
            ->where('email', $credentials['email'])
            ->first();
        if ($remoteUser && Hash::check($credentials['password'], $remoteUser->password)) {
            $localUser = User::updateOrCreate(
                ['email' => $remoteUser->email],
                [
                    'name' => $remoteUser->name,
                    'password' => Hash::make($credentials['password']),
                ]
            );
            Auth::login($localUser);
            Session::regenerate();
            return redirect()->intended(route('dashboard', absolute: false));
        }
        throw ValidationException::withMessages([
            'email' => __('auth.failed'),
        ]);
    }
}
