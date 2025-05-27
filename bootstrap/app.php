<?php

use App\Http\Middleware\AuthEmployer;
use App\Http\Middleware\EnsureEmployerCompanyExists;
use App\Http\Middleware\EnsureNoCompany;
use App\Http\Middleware\GuestEmployer;
use App\Http\Middleware\HandleAppearance;
use App\Http\Middleware\HandleInertiaRequests;
use App\Http\Middleware\HasCompany;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->encryptCookies(except: ['appearance', 'sidebar_state']);

        $middleware->web(append: [
            HandleAppearance::class,
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
        ]);

        $middleware->alias([
            "ensure.employer.company.exists" => EnsureEmployerCompanyExists::class
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
