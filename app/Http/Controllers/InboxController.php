<?php

namespace App\Http\Controllers;

use App\Enums\MessageStatusEnum;
use App\Models\Chat;
use App\Models\Message;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class InboxController extends Controller
{
    public function index()
    {
        $userId = Auth::id();

        $chats = Chat::with([
            'participants',
            'messages',
        ])
            ->whereHas('participants', fn($q) => $q->where('user_id', $userId))
            ->get();

        if (Auth::user()->hasRole('jobseeker')) {
            $view = 'jobseeker/inbox';
        } elseif (Auth::user()->hasRole('employer')) {
            $view = 'employer/inbox';
        } else {
            abort(403, 'Unauthorized');
        }

        return Inertia::render($view, [
            'chats' => $chats,
            'currentUserId' => Auth::id()
        ]);
    }

    public function sendMessage(Request $request, Chat $chat)
    {
        $request->validate([
            'chat_id' => 'required|exists:chats,id',
            'message' => 'required|string',
        ]);

        $message = Message::create([
            'chat_id' => $request->chat_id,
            'user_id' => Auth::id(),
            'message' => $request->message,
            'status' => MessageStatusEnum::SENT->value
        ]);

        return back();
    }
}
