<?php

namespace App\Actions;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Collection as SupportCollection;
use Spatie\Permission\Models\Permission;
use Illuminate\Support\Str;

class GetGroupedPermissionsAction
{
    /**
     * Create a new class instance.
     */
    public function __construct(private Str $str) {}

    public function handle(Collection $permissions): SupportCollection
    {
        return $permissions->groupBy(function (Permission $permission) {
            static $prefixes = [
                'view_any_',
                'view_',
                'create_',
                'update_',
                'delete_',
                'restore_',
                'force_delete_',
            ];

            $name = $permission->name;

            foreach ($prefixes as $prefix) {
                if ($this->str->startsWith($name, $prefix)) {
                    return $this->str->after($name, $prefix);
                }
            }

            return $name;
        })
            ->mapWithKeys(function ($permissions, $group) {
                $transformedGroup = $this->str->of($group)
                    ->replace('_', ' ')
                    ->ucfirst()
                    ->__toString();

                return [$transformedGroup => $permissions->map->only(['id', 'name'])];
            })
            ->sortKeys();
    }
}