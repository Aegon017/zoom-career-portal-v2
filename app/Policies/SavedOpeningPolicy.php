<?php

namespace App\Policies;

use App\Models\SavedOpening;
use App\Models\User;

class SavedOpeningPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->can('view_any_saved_opening');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, SavedOpening $savedOpening): bool
    {
        return $user->can('view_saved_opening');
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->can('create_saved_opening');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, SavedOpening $savedOpening): bool
    {
        return $user->can('update_saved_opening');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, SavedOpening $savedOpening): bool
    {
        return $user->can('delete_saved_opening');
    }
}
