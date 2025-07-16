<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureStudentIsVerified
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {

        $user = $request->user();

        if (!$user || !$user->hasRole('jobseeker')) {
            abort(403, 'Unauthorized.');
        }

        if (!$user->profile?->is_verified) {
            return to_route('student.verification.notice');
        }

        return $next($request);
    }
}
