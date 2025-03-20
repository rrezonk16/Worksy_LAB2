<?php

namespace Database\Seeders;
use App\Models\Permission;
use Illuminate\Database\Seeder;

class PermissionSeeder extends Seeder
{
    public function run()
    {
        // Create permissions
        Permission::create(['name' => 'READ_USERS']);
        Permission::create(['name' => 'EDIT_USERS']);
        Permission::create(['name' => 'ADD_USERS']);
        Permission::create(['name' => 'UPDATE_USERS']);
    }
}
