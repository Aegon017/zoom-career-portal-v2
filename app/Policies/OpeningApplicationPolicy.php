<?php

namespace App\Policies;

use App\Models\OpeningApplication;
use App\Models\User;

class OpeningApplicationPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->can('view_any_opening_application');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, OpeningApplication $openingApplication): bool
    {
        return $user->can('view_opening_application');
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->can('create_opening_application');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, OpeningApplication $openingApplication): bool
    {
        return $user->can('update_opening_application');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, OpeningApplication $openingApplication): bool
    {
        return $user->can('delete_opening_application');
    }
}
