<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use App\Enums\VerificationStatusEnum;
use App\Models\SiteSetting;
use Illuminate\Foundation\Inspiring;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Middleware;

final class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        [$message, $author] = str(Inspiring::quotes()->random())->explode('-');

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'quote' => ['message' => mb_trim($message), 'author' => mb_trim($author)],
            'auth' => [
                'user' => Auth::user(),
                'isEmployerVerified' => Auth::user()?->companyUsers()?->latest()->first()?->verification_status === VerificationStatusEnum::Verified->value,
                'roles' => Auth::user()?->getRoleNames() ?? [],
                'permissions' => Auth::user()?->getAllPermissions()->pluck('name') ?? [],
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
            'flash' => [
                'success' => fn() => $request->session()->get('success'),
                'error' => fn() => $request->session()->get('error'),
            ],
            'features' => [
                'people_feature' => (bool) SiteSetting::where('name', 'people_feature')->value('status'),
            ],
            'url' => fn() => request()->getRequestUri(),
        ];
    }
}
