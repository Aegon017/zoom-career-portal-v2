<?php

namespace App\Console\Commands;

use App\Models\User;
use Database\Factories\UserFactory;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class CreateSuperAdmin extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:create-super-admin';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $user = User::factory()->create([
            'name' => 'Admin',
            'email' => 'admin@zoomgroup.com',
            'password' => Hash::make('12345678'),
        ]);

        $permissions = Permission::all();
        $role = Role::create(['name' => 'Super Admin']);
        $role->syncPermissions($permissions);
        $user->assignRole($role);
    }
}
