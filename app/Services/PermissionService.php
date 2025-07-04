<?php

declare(strict_types=1);

namespace App\Services;

use Spatie\Permission\Models\Permission;

final class PermissionService
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
                        return str_replace('_', ' ', ucfirst(mb_substr($name, mb_strlen($prefix))));
                    }
                }

                return $name;
            })
            ->map(fn ($permissions) => $permissions->map(fn ($permission): array => [
                'id' => $permission->id,
                'name' => $permission->name,
            ]))->sortKeys();
    }
}
