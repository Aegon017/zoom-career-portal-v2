<?php

namespace App\Services;

use App\Http\Resources\PermissionResource;
use Spatie\Permission\Models\Permission;

class PermissionService
{
    public function getGroupedPermissions()
    {
        return Permission::get()
            ->groupBy(function ($permission) {
                $name = $permission->name;

                $prefixes = [
                    'view_any_',
                    'view_',
                    'create_',
                    'update_',
                    'delete_',
                ];

                foreach ($prefixes as $prefix) {
                    if (str_starts_with($name, $prefix)) {
                        return str_replace('_', ' ', ucfirst(substr($name, strlen($prefix))));
                    }
                }

                return $name;
            })
            ->map(function ($permissions) {
                return $permissions->map(function ($permission) {
                    return [
                        'id' => $permission->id,
                        'name' => $permission->name,
                    ];
                });
            })->sortKeys();
    }
}
