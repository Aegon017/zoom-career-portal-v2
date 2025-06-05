<?php

declare(strict_types=1);

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

final class EmailVerificationNotificationController extends Controller
{
    /**
     * Send a new email verification notification.
     */
    public function store(Request $request): RedirectResponse
    {
        if ($request->user()->hasVerifiedEmail()) {
            if ($request->user()->hasRole('super_admin')) {
                $redirect = 'admin.dashboard';
            } elseif ($request->user()->hasRole('employer')) {
                $redirect = 'employer.dashboard';
            } elseif ($request->user()->hasRole('jobseeker')) {
                $redirect = 'jobseeker.explore';
            } else {
                $redirect = '/';
            }

            return redirect()->intended(route($redirect, absolute: false));
        }

        $request->user()->sendEmailVerificationNotification();

        return back()->with('status', 'verification-link-sent');
    }
}
