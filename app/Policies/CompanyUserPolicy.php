<?php

namespace App\Policies;

use App\Models\CompanyUser;
use App\Models\User;

class CompanyUserPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->can('view_any_company_user');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, CompanyUser $companyUser): bool
    {
        return $user->can('view_company_user');
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->can('create_company_user');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, CompanyUser $companyUser): bool
    {
        return $user->can('update_company_user');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, CompanyUser $companyUser): bool
    {
        return $user->can('delete_company_user');
    }
}
