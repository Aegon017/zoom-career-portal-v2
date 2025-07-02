<?php

namespace App\Policies;

use App\Models\Shortlist;
use App\Models\User;

class ShortlistPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->can('view_any_shortlist');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Shortlist $shortlist): bool
    {
        return $user->can('view_shortlist');
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->can('create_shortlist');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Shortlist $shortlist): bool
    {
        return $user->can('update_shortlist');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Shortlist $shortlist): bool
    {
        return $user->can('delete_shortlist');
    }
}
