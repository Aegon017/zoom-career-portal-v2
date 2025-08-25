<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Chat;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

final class ChatLogController extends Controller
{
    public function __invoke(Request $request)
    {
        $query = Chat::with(['participants.user.roles', 'messages.user']);

        $query->when($request->student, function ($q) use ($request) {
            $q->whereHas('participants.user.roles', function ($q) use ($request) {
                $q->where('users.id', $request->student)->where('roles.name', 'jobseeker');
            });
        });

        $query->when($request->employer, function ($q) use ($request) {
            $q->whereHas('participants.user.roles', function ($q) use ($request) {
                $q->where('users.id', $request->employer)->where('roles.name', 'employer');
            });
        });

        $query->when($request->start_date, function ($q) use ($request) {
            $q->whereHas('messages', function ($q) use ($request) {
                $q->whereDate('created_at', '>=', $request->start_date);
            });
        });

        $query->when($request->end_date, function ($q) use ($request) {
            $q->whereHas('messages', function ($q) use ($request) {
                $q->whereDate('created_at', '<=', $request->end_date);
            });
        });

        return Inertia::render('admin/chat-logs', [
            'chats' => $query->paginate(10)->withQueryString(),
            'filters' => $request->only(['student', 'employer', 'start_date', 'end_date']),
            'students' => User::whereHas('roles', fn($q) => $q->where('name', 'jobseeker'))->get(['id', 'name']),
            'employers' => User::whereHas('roles', fn($q) => $q->where('name', 'employer'))->get(['id', 'name']),
        ]);
    }
}
