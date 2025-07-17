<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

final class EnsureStudentIsVerified
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {

        $user = $request->user();

        if (! $user || ! $user->hasRole('jobseeker')) {
            abort(403, 'Unauthorized.');
        }

        if (! $user->profile?->is_verified) {
            return to_route('student.verification.notice');
        }

        return $next($request);
    }
}
