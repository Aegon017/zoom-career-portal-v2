<?php

namespace App\Policies;

use App\Models\ChatMessage;
use App\Models\User;

class ChatMessagePolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->can('view_any_chat_message');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, ChatMessage $chatMessage): bool
    {
        return $user->can('view_chat_message');
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->can('create_chat_message');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, ChatMessage $chatMessage): bool
    {
        return $user->can('update_chat_message');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, ChatMessage $chatMessage): bool
    {
        return $user->can('delete_chat_message');
    }
}
