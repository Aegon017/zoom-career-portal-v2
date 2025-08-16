<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

final class CheckProfileComplete
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();

        if (! $user) {
            return $request->expectsJson()
                ? response()->json(['error' => 'Unauthorized'], 401)
                : redirect()->guest(route('login'));
        }

        if ($user->hasRole('jobseeker') && ! $this->isProfileComplete($user)) {
            return to_route('jobseeker.profile.wizard')->with('error', 'Please complete your profile');
        }

        return $next($request);
    }

    private function isProfileComplete($user): bool
    {
        return $user->profile &&
            $user->skills->count() > 0 &&
            $user->educations->count() > 0 &&
            $user->personal_detail && $user->userLanguages && $user->workPermits;
    }
}
