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

        $onboarding = EmployerOnBoarding::firstOrCreate(
            ['user_id' => $user->id],
            [
                'step' => EmployerOnBoardingEnum::PROFILE_SETUP->value,
                'is_completed' => false,
            ]
        );

        $currentStep = $onboarding->step->value;
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

        // Allow access if on the correct step or in an excluded route
        if (in_array($routeName, $excludedRoutes, true) || $routeName === $expectedRoute) {
            return $next($request);
        }

        // Special case: if company_name is missing during COMPANY_SETUP step, fallback to create/join
        if (
            $expectedRoute === 'employer.on-boarding.setup.company' &&
            ! $request->filled('company_name')
        ) {
            $user->employerOnBording()->update([
                'step' => EmployerOnBoardingEnum::COMPANY_CREATE_OR_JOIN->value,
                'is_completed' => false,
            ]);

            return redirect()->route('employer.on-boarding.company.create-or-join');
        }

        // Redirect to the expected step (add company_name only if needed)
        return redirect()->route(
            $expectedRoute,
            $expectedRoute === 'employer.on-boarding.setup.company'
                ? ['company_name' => $request->company_name]
                : []
        );
    }
}
