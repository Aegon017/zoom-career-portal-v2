<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Events\MessageSent;
use App\Models\Chat;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

final class InboxController extends Controller
{
    public function index(Request $request)
    {
        $userId = Auth::id();

        $chats = Chat::with([
            'participants.user',
            'messages' => fn ($q) => $q->latest()->limit(1),
        ])
            ->whereHas('participants', fn ($q) => $q->where('user_id', $userId))
            ->get();

        $activeChat = null;
        $targetUser = null;

        if ($request->has('chat')) {
            $activeChat = Chat::with(['participants.user', 'messages.user'])
                ->where('id', $request->chat)
                ->whereHas('participants', fn ($q) => $q->where('user_id', $userId))
                ->first();
        } elseif ($request->has('user')) {
            $targetUser = User::findOrFail($request->user);

            $existingChat = Chat::whereHas('participants', fn ($q) => $q->where('user_id', $userId))
                ->whereHas('participants', fn ($q) => $q->where('user_id', $targetUser->id))
                ->first();

            if ($existingChat) {
                return redirect()->route('inbox.index', ['chat' => $existingChat->id]);
            }

            // Create new chat immediately
            $chat = Chat::create();
            $chat->participants()->createMany([
                ['user_id' => $userId],
                ['user_id' => $targetUser->id],
            ]);

            return redirect()->route('inbox.index', ['chat' => $chat->id]);
        }

        $view = Auth::user()->hasRole('employer') ? 'employer/inbox' : 'jobseeker/inbox';

        return Inertia::render($view, [
            'chats' => $chats,
            'currentUserId' => $userId,
            'activeChat' => $activeChat,
            'targetUser' => $targetUser,
        ]);
    }

    public function sendMessage(Request $request)
    {
        $request->validate([
            'message' => 'required|string',
            'chat_id' => 'nullable|exists:chats,id',
            'user_id' => 'nullable|exists:users,id',
        ]);

        $userId = Auth::id();
        $chat = null;

        if ($request->chat_id) {
            $chat = Chat::findOrFail($request->chat_id);
        } elseif ($request->user_id) {
            $existing = Chat::whereHas('participants', fn ($q) => $q->where('user_id', $userId))
                ->whereHas('participants', fn ($q) => $q->where('user_id', $request->user_id))
                ->first();

            if ($existing) {
                $chat = $existing;
            } else {
                $chat = Chat::create();
                $chat->participants()->createMany([
                    ['user_id' => $userId],
                    ['user_id' => $request->user_id],
                ]);
            }
        }

        $message = $chat->messages()->create([
            'user_id' => $userId,
            'message' => $request->message,
        ]);

        $receiverId = $chat->participants()
            ->where('user_id', '!=', $userId)
            ->first()
            ?->user_id;

        broadcast(new MessageSent($message, $receiverId))->toOthers();

        return back();
    }
}
