<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Notifications\DatabaseNotification;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller
{
    public function index()
    {
        $notifications = Auth::user()->notifications;
        return back()->with([
            'notifications' => $notifications
        ]);
    }

    public function markAsRead(string $notificationId)
    {
        DatabaseNotification::find($notificationId)->markAsRead();
        return back();
    }
}
