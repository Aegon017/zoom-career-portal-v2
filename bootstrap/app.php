<?php

declare(strict_types=1);

use App\Http\Middleware\CheckProfileComplete;
use App\Http\Middleware\EmployerVerified;
use App\Http\Middleware\EnsurePhoneIsVerified;
use App\Http\Middleware\EnsureStudentIsVerified;
use App\Http\Middleware\HandleAppearance;
use App\Http\Middleware\HandleInertiaRequests;
use App\Http\Middleware\RedirectIfEmployerOnboardingIncomplete;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;
use Spatie\Permission\Middleware\RoleMiddleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        channels: __DIR__.'/../routes/channels.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->encryptCookies(except: ['appearance', 'sidebar_state']);

        $middleware->web(append: [
            HandleAppearance::class,
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
        ]);

        $middleware->alias([
            'employer_is_verified' => EmployerVerified::class,
            'employer.onboarding' => RedirectIfEmployerOnboardingIncomplete::class,
            'role' => RoleMiddleware::class,
            'verified.phone' => EnsurePhoneIsVerified::class,
            'verified.student' => EnsureStudentIsVerified::class,
            'profile.complete' => CheckProfileComplete::class,
        ]);

        $middleware->validateCsrfTokens(
            except: [
                'chat',
                'temp-upload',
                'employer/profile/image-upload',
                'employer/profile/image-remove',
                'company/profile/logo-upload',
                'company/profile/logo-remove',
                'employer/ai/job-description',
                'employer/ai/match-score/*',
                'ai/summary',
            ]
        );
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
