<?php

declare(strict_types=1);

namespace App\Providers;

use Illuminate\Auth\Middleware\RedirectIfAuthenticated;
use Illuminate\Database\Eloquent\Model;
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
        Model::shouldBeStrict();
        Model::unguard();
        Vite::useAggressivePrefetching();
        JsonResource::withoutWrapping();

        RedirectIfAuthenticated::redirectUsing(function () {
            $user = Auth::user();

            if ($user) {
                $role = $user->getRoleNames()->first();

                return match ($role) {
                    'super_admin' => route('admin.dashboard'),
                    'jobseeker' => route('jobseeker.explore'),
                    'employer' => route('employer.dashboard'),
                    default => '/',
                };
            }

            return '/';
        });
    }
}
