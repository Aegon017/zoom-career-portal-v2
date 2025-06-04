<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Events\EmployerRegisteredEvent;
use App\Models\User;
use App\Notifications\EmployerRegisteredNotification;

final class SendEmployerVerifyNotification
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(EmployerRegisteredEvent $event): void
    {
        $user = User::where('email', 'admin@zoomgroup.com')->first();
        $employer = $event->employer?->load(['user', 'company']);
        $user->notify(new EmployerRegisteredNotification($employer?->id, $employer?->company?->company_name, $employer?->user?->name));
    }
}
