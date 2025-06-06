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
        $isCompleted = $onboarding->is_completed;

        $routeName = $request->route()?->getName();

        $excludedRoutes = [
            // Allowed steps even if onboarding is incomplete
            'employer.on-boarding.setup.profile',
            'employer.on-boarding.setup.profile.store',
            'employer.on-boarding.setup.company',
            'employer.on-boarding.setup.company.store',
            'employer.on-boarding.setup.company.verification.pending',
            'employer.on-boarding.company.create-or-join',
            'employer.on-boarding.company.create-or-join.handle',
            'employer.on-boarding.company.join.verification.pending',
        ];

        $stepToRoute = [
            EmployerOnBoardingEnum::PROFILE_SETUP->value => 'employer.on-boarding.setup.profile',
            EmployerOnBoardingEnum::COMPANY_JOIN_VERIFICATION->value => 'employer.on-boarding.company.join.verification.pending',
            EmployerOnBoardingEnum::COMPANY_CREATE_OR_JOIN->value => 'employer.on-boarding.company.create-or-join',
            EmployerOnBoardingEnum::COMPANY_SETUP->value => 'employer.on-boarding.setup.company',
            EmployerOnBoardingEnum::COMPANY_SETUP_VERIFICATION->value => 'employer.on-boarding.setup.company.verification.pending',
        ];

        $expectedRoute = $stepToRoute[$currentStep] ?? null;

        if ($isCompleted) {
            return $next($request);
        }

        if (in_array($routeName, $excludedRoutes, true) || $routeName === $expectedRoute) {
            return $next($request);
        }

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

        return redirect()->route(
            $expectedRoute,
            $expectedRoute === 'employer.on-boarding.setup.company'
                ? ['company_name' => $request->company_name]
                : []
        );
    }
}
