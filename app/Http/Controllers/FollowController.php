<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

final class FollowController extends Controller
{
    public function follow(Request $request)
    {
        $request->validate([
            'type' => 'required|in:user,company',
            'id' => 'required|integer',
        ]);

        $user = Auth::user();
        $model = match ($request->type) {
            'user' => User::findOrFail($request->id),
            'company' => Company::findOrFail($request->id),
        };

        if ($user->id === $model->id) {
            return back()->withErrors(['Cannot follow yourself']);
        }

        if (! $user->isFollowing($model)) {
            $user->follows()->attach($model);
        }

        return back()->with('success', 'Followed successfully.');
    }

    public function unfollow(Request $request)
    {
        $request->validate([
            'type' => 'required|in:user,company',
            'id' => 'required|integer',
        ]);

        $user = Auth::user();
        $model = match ($request->type) {
            'user' => User::findOrFail($request->id),
            'company' => Company::findOrFail($request->id),
        };

        $user->follows()->detach($model);

        return back()->with('success', 'Unfollowed successfully.');
    }

    public function toggle(Request $request): \Illuminate\Http\RedirectResponse
    {
        $request->validate([
            'followable_id' => 'required|integer',
            'followable_type' => 'required|in:user,company',
        ]);

        $user = Auth::user();

        $followableType = match ($request->followable_type) {
            'user' => User::class,
            'company' => Company::class,
        };

        $existing = $user->follows()
            ->where('followable_type', $followableType)
            ->where('followable_id', $request->followable_id)
            ->first();

        if ($existing) {
            $existing->delete();
        } else {
            $user->follows()->create([
                'followable_id' => $request->followable_id,
                'followable_type' => $followableType,
            ]);
        }

        return back();
    }
}
