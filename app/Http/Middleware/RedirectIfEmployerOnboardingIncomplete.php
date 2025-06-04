<?php

namespace App\Http\Middleware;

use App\Enums\EmployerOnBoardingEnum;
use App\Models\EmployerOnBoarding;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class RedirectIfEmployerOnboardingIncomplete
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = Auth::user();

        if (!$user || !$user->hasRole('employer')) {
            return $next($request);
        }

        $onboarding = EmployerOnBoarding::firstOrCreate(
            ['user_id' => $user->id],
            [
                'step' => EmployerOnBoardingEnum::PROFILE_SETUP,
                'is_completed' => false,
            ]
        );

        if ($onboarding->is_completed) {
            return $next($request);
        }

        return match ($onboarding->step) {
            EmployerOnBoardingEnum::PROFILE_SETUP => redirect()->route('employer.on-boarding.profile.setup'),
            EmployerOnBoardingEnum::COMPANY_CREATE_OR_JOIN => redirect()->route('employer.on-boarding.company.choose'),
            EmployerOnBoardingEnum::COMPANY_JOIN_VERIFICATION => redirect()->route('employer.on-boarding.company.verify'),
            EmployerOnBoardingEnum::COMPANY_SETUP => redirect()->route('employer.on-boarding.company.setup'),
            EmployerOnBoardingEnum::ACCOUNT_VERIFICATION => redirect()->route('employer.on-boarding.verify'),
            default => redirect()->route('employer.dashboard'),
        };
    }
}
