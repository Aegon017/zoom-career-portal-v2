<?php

declare(strict_types=1);

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('App.Models.User.{id}', fn ($user, $id): bool => (int) $user->id === (int) $id);

Broadcast::channel('chat.{chatId}', fn ($user, $chatId) => $user->chats()->where('chats.id', $chatId)->exists());
