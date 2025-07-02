<?php

namespace App\Services;

use Spatie\Permission\Models\Role;

class RoleService
{
    public function createRoleWithPermissions(array $data): Role
    {
        $role = Role::create([
            'name' => $data['name'],
        ]);

        if (!empty($data['permissions'])) {
            $role->syncPermissions($data['permissions']);
        }

        return $role;
    }

    public function updateRoleWithPermissions(string $id, array $data): Role
    {
        $role = Role::find($id);

        $role->update($data);

        $role->syncPermissions($data['permissions']);

        return $role;
    }

    public function deleteRole(string $id): void
    {
        Role::destroy($id);
    }

    public function deleteRoles(array $ids): void
    {
        Role::destroy($ids);
    }
}
