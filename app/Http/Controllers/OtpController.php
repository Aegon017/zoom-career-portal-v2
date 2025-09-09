<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Services\OtpService;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

final class OtpController extends Controller
{
    public function index(): Response
    {
        $user = Auth::user();
        $otp = $user->otps()
            ->where('expires_at', '>', now())
            ->latest()
            ->first();

        return Inertia::render('auth/verify-phone', [
            'user' => $user,
            'expires_at' => optional($otp?->expires_at)?->toIso8601String(),
            'step' => $user->phone_verified_at ? 'verified' : ($otp ? 'verify' : 'request'),
        ]);
    }

    public function send(Request $request, OtpService $otpService)
    {
        $request->validate([
            'phone' => 'required|string|unique:users,phone,'.Auth::id(),
        ]);

        $user = Auth::user();

        try {
            $otp = $otpService->sendOtp($user, $request->phone);
        } catch (Exception $exception) {
            return back()
                ->withInput()
                ->withErrors(['phone' => $exception->getMessage()])
                ->with([
                    'step' => 'request',
                    'expires_at' => null,
                ]);
        }

        return redirect()->route('otp.index')->with([
            'step' => 'verify',
            'expires_at' => $otp->expires_at->toIso8601String(),
        ]);
    }

    public function verify(Request $request, OtpService $otpService)
    {
        $request->validate([
            'code' => 'required|string|size:6',
        ]);

        $user = Auth::user();

        if (! $otpService->verifyOtp($user)) {
            return back()
                ->withInput()
                ->withErrors(['code' => 'Invalid or expired OTP.'])
                ->with([
                    'step' => 'verify',
                    'expires_at' => null,
                ]);
        }

        if ($user->hasRole('employer')) {
            $route = 'employer.dashboard';
        } elseif ($user->hasRole('jobseeker')) {
            $route = 'jobseeker.dashboard';
        } else {
            $route = '/';
        }

        return redirect()->route($route)->with([
            'step' => 'verified',
            'expires_at' => null,
        ]);
    }
}
