<?php

namespace App\Policies;

use App\Models\EmployerOnBoarding;
use App\Models\User;

class EmployerOnBoardingPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->can('view_any_employer_on_boarding');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, EmployerOnBoarding $employerOnBoarding): bool
    {
        return $user->can('view_employer_on_boarding');
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->can('create_employer_on_boarding');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, EmployerOnBoarding $employerOnBoarding): bool
    {
        return $user->can('update_employer_on_boarding');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, EmployerOnBoarding $employerOnBoarding): bool
    {
        return $user->can('delete_employer_on_boarding');
    }
}
