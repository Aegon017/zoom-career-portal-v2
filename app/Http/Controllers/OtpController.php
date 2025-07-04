<?php

namespace App\Http\Controllers;

use App\Services\OtpService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class OtpController extends Controller
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
            'phone' => 'required|numeric'
        ]);

        $user = Auth::user();

        try {
            $otp = $otpService->sendOtp($user, $request->phone);
        } catch (\Exception $e) {
            return back()
                ->withInput()
                ->withErrors(['phone' => $e->getMessage()])
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
            'code' => 'required|string|size:6'
        ]);

        $user = Auth::user();

        if (! $otpService->verifyOtp($user, $request->code)) {
            return back()
                ->withInput()
                ->withErrors(['code' => 'Invalid or expired OTP.'])
                ->with([
                    'step' => 'verify',
                    'expires_at' => null,
                ]);
        }

        return redirect()->route('employer.dashboard')->with([
            'step' => 'verified',
            'expires_at' => null,
        ]);
    }
}
