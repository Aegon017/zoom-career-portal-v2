<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use Illuminate\Notifications\DatabaseNotification;
use Illuminate\Support\Facades\Auth;

final class NotificationController extends Controller
{
    public function index()
    {
        $notifications = Auth::user()->notifications;

        return back()->with([
            'notifications' => $notifications,
        ]);
    }

    public function markAsRead(string $notificationId)
    {
        DatabaseNotification::find($notificationId)->markAsRead();

        return back();
    }

    public function markAllAsRead()
    {
        Auth::user()->notifications()->markAsRead();

        return back();
    }
}
