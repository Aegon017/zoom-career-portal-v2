<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use App\Enums\VerificationStatusEnum;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

final class EmployerVerified
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = Auth::user();

        $isVerified = $user?->companies->first()?->pivot->status === VerificationStatusEnum::Verified->value;

        if (! $isVerified) {
            return redirect()->route('account.verification.notice');
        }

        return $next($request);
    }
}
