<?php

namespace App\Policies;

use App\Models\OpeningTitle;
use App\Models\User;

class OpeningTitlePolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->can('view_any_opening_title');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, OpeningTitle $openingTitle): bool
    {
        return $user->can('view_opening_title');
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->can('create_opening_title');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, OpeningTitle $openingTitle): bool
    {
        return $user->can('update_opening_title');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, OpeningTitle $openingTitle): bool
    {
        return $user->can('delete_opening_title');
    }
}
