<?php

declare(strict_types=1);

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Auth\Events\Verified;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Http\RedirectResponse;

final class VerifyEmailController extends Controller
{
    /**
     * Mark the authenticated user's email address as verified.
     */
    public function __invoke(EmailVerificationRequest $request): RedirectResponse
    {
        if ($request->user()->hasRole('super_admin')) {
            $redirect = 'admin.dashboard';
        } elseif ($request->user()->hasRole('employer')) {
            $redirect = 'employer.dashboard';
        } elseif ($request->user()->hasRole('jobseeker')) {
            $redirect = 'jobseeker.dashboard';
        } else {
            $redirect = '/';
        }

        if ($request->user()->hasVerifiedEmail()) {
            return redirect()->intended(route($redirect, absolute: false).'?verified=1');
        }

        if ($request->user()->markEmailAsVerified()) {
            /** @var \Illuminate\Contracts\Auth\MustVerifyEmail $user */
            $user = $request->user();

            event(new Verified($user));
        }

        return redirect()->intended(route($redirect, absolute: false).'?verified=1');
    }
}
