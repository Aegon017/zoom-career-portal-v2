<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Chat;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ChatLogController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        $chats = Chat::with([
            'participants.user:id,name,email',
            'messages.user:id,name'
        ])
            ->orderByDesc('updated_at')
            ->paginate(10);

        return Inertia::render('admin/chat-logs', [
            'chats' => $chats,
        ]);
    }
}
