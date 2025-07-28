<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckProfileComplete
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();

        if (!$user) {
            return $request->expectsJson()
                ? response()->json(['error' => 'Unauthorized'], 401)
                : redirect()->guest(route('login'));
        }

        if ($user->hasRole('jobseeker') && !$this->isProfileComplete($user)) {
            return to_route('jobseeker.profile.show', $user->id)->with('error', 'Complete your profile');
        }

        return $next($request);
    }

    protected function isProfileComplete($user)
    {
        return $user->profile &&
            $user->profile->summary &&
            $user->skills->count() > 0 &&
            $user->educations->count() > 0 &&
            $user->personal_detail && $user->userLanguages && $user->workPermits;
    }
}
