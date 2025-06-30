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

<<<<<<< HEAD
        $isVerified = $user?->companyUsers->first()?->status === VerificationStatusEnum::Verified->value;
=======
        $isVerified = $user?->companyUsers()->latest()?->first()?->verification_status === VerificationStatusEnum::Verified->value;
>>>>>>> v3

        if (! $isVerified) {
            return redirect()->route('account.verification.notice');
        }

        return $next($request);
    }
}
