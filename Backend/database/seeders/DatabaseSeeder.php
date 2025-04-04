<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        $this->call([
            RoleSeeder::class,             // Seeder for roles (admin, job_seeker, etc.)
            PermissionSeeder::class,       // Seeder for permissions (CRUD, view, etc.)
            RolePermissionSeeder::class,   // Seeder for linking roles and permissions
            CompanyRolesSeeder::class,     // Seeder for company-specific roles
            UserSeeder::class,

        ]);
    }
}
