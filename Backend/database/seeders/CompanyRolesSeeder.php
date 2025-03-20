<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\CompanyRole;
use App\Models\CompanyPermission;
use App\Models\CompanyRolesPermission;

class CompanyRolesSeeder extends Seeder
{
    public function run()
    {
        // Create the "Admin" role
        $adminRole = CompanyRole::create([
            'name' => 'Admin',
        ]);

        // Create the "Read_Applicants" permission
        $readApplicantsPermission = CompanyPermission::create([
            'name' => 'Read_Applicants',
        ]);

        // Link the "Admin" role with the "Read_Applicants" permission in the pivot table
        CompanyRolesPermission::create([
            'c_role_id' => $adminRole->id,
            'c_permission_id' => $readApplicantsPermission->id,
        ]);

        $this->command->info('Admin role and permissions seeded!');
    }
}
