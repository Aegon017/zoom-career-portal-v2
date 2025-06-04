<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

final class EnsureEmployerCompanyExists
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();
        $employer = $user?->employer;
        $company = $employer?->company;

        if ($employer) {
            if (! $company && ! $request->routeIs('company.register')) {
                return to_route('company.register');
            }

            if ($company && $request->routeIs('company.register')) {
                return to_route('dashboard');
            }
        }

        return $next($request);
    }
}
