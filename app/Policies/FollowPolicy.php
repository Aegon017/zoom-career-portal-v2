<?php

namespace App\Policies;

use App\Models\Follow;
use App\Models\User;

class FollowPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->can('view_any_follow');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Follow $follow): bool
    {
        return $user->can('view_follow');
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->can('create_follow');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Follow $follow): bool
    {
        return $user->can('update_follow');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Follow $follow): bool
    {
        return $user->can('delete_follow');
    }
}
