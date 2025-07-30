<?php

declare(strict_types=1);

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

final class EmailVerificationPromptController extends Controller
{
    /**
     * Show the email verification prompt page.
     */
    public function __invoke(Request $request): Response|RedirectResponse
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

        return $request->user()->hasVerifiedEmail()
            ? redirect()->intended(route($redirect, absolute: false))
            : Inertia::render('auth/verify-email', ['status' => $request->session()->get('status')]);
    }
}
