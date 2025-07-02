<?php

namespace App\Policies;

use App\Models\SiteSetting;
use App\Models\User;

class SiteSettingPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->can('view_any_site_setting');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, SiteSetting $siteSetting): bool
    {
        return $user->can('view_site_setting');
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->can('create_site_setting');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, SiteSetting $siteSetting): bool
    {
        return $user->can('update_site_setting');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, SiteSetting $siteSetting): bool
    {
        return $user->can('delete_site_setting');
    }
}
