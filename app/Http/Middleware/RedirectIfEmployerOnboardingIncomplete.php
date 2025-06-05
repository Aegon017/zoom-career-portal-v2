<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use App\Enums\EmployerOnBoardingEnum;
use App\Models\EmployerOnBoarding;
use Closure;
use Illuminate\Http\Request;

final class RedirectIfEmployerOnboardingIncomplete
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();

        if (! $user) {
            return redirect()->route('login');
        }

        $employerOnboarding = EmployerOnBoarding::firstOrCreate(
            ['user_id' => $user->id],
            [
                'step' => EmployerOnBoardingEnum::PROFILE_SETUP->value,
                'is_completed' => false,
            ]
        );

        $currentStep = $employerOnboarding->step->value;
        $routeName = $request->route()?->getName();

        $excludedRoutes = [
            'employer.on-boarding.setup.profile.store',
            'employer.on-boarding.setup.company.store',
            'employer.on-boarding.company.create-or-join.handle',
        ];

        $stepToRoute = [
            EmployerOnBoardingEnum::PROFILE_SETUP->value => 'employer.on-boarding.setup.profile',
            EmployerOnBoardingEnum::COMPANY_JOIN_VERIFICATION->value => 'employer.on-boarding.company.join.verification.pending',
            EmployerOnBoardingEnum::COMPANY_CREATE_OR_JOIN->value => 'employer.on-boarding.company.create-or-join',
            EmployerOnBoardingEnum::COMPANY_SETUP->value => 'employer.on-boarding.setup.company',
            EmployerOnBoardingEnum::COMPANY_SETUP_VERIFICATION->value => 'employer.on-boarding.setup.company.verification.pending',
        ];

        $expectedRoute = $stepToRoute[$currentStep] ?? null;

        if ($routeName === $expectedRoute || in_array($routeName, $excludedRoutes)) {
            return $next($request);
        }
        if ($expectedRoute) {
            if ($expectedRoute === 'employer.on-boarding.setup.company') {
                return redirect()->route($expectedRoute, ['company_name' => $request->company_name]);
            }

            return redirect()->route($expectedRoute);
        }

        return $next($request);
    }
}
