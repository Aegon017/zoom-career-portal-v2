<?php

namespace App\Policies;

use App\Models\SkillUser;
use App\Models\User;

class SkillUserPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->can('view_any_skill_user');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, SkillUser $skillUser): bool
    {
        return $user->can('view_skill_user');
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->can('create_skill_user');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, SkillUser $skillUser): bool
    {
        return $user->can('update_skill_user');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, SkillUser $skillUser): bool
    {
        return $user->can('delete_skill_user');
    }
}
