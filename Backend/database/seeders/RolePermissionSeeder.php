<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Role;
use App\Models\Permission;

class RolePermissionSeeder extends Seeder
{
    public function run()
    {
        // Assuming you already have a role created (e.g., Admin)
        $adminRole = Role::firstOrCreate(['name' => 'admin']);

        // Create permissions
        $readUsers = Permission::firstOrCreate(['name' => 'READ_USERS']);
        $editUsers = Permission::firstOrCreate(['name' => 'EDIT_USERS']);
        $addUsers = Permission::firstOrCreate(['name' => 'ADD_USERS']);
        $updateUsers = Permission::firstOrCreate(['name' => 'UPDATE_USERS']);

        // Assign permissions to the admin role
        $adminRole->givePermissionTo($readUsers);
        $adminRole->givePermissionTo($editUsers);
        $adminRole->givePermissionTo($addUsers);
        $adminRole->givePermissionTo($updateUsers);
    }
}
