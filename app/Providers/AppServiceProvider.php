<?php

declare(strict_types=1);

namespace App\Providers;

use Illuminate\Auth\Middleware\RedirectIfAuthenticated;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

final class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::useAggressivePrefetching();
        JsonResource::withoutWrapping();
        $this->redirectAuthenticatedUser();
    }

    private function redirectAuthenticatedUser(): void
    {
        RedirectIfAuthenticated::redirectUsing(function (): string {
            $user = Auth::user();

            if ($user) {
                $role = $user->getRoleNames()->first();

                return match ($role) {
                    'jobseeker' => route('jobseeker.dashboard'),
                    'employer' => route('employer.dashboard'),
                    default => route('admin.dashboard'),
                };
            }

            return '/';
        });
    }
}
