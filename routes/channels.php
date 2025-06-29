<?php

declare(strict_types=1);

use App\Models\User;
use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('App.Models.User.{id}', fn ($user, $id): bool => (int) $user->id === (int) $id);

Broadcast::channel('chat.{receiverId}', fn(User $user, $receiverId): bool => (int) $user->id === (int) $receiverId);
