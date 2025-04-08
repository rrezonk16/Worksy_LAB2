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
        // Create roles for each company
        $adminRole = CompanyRole::create([
            'name' => 'Admin',
        ]);

        $managerRole = CompanyRole::create([
            'name' => 'Manager',
        ]);

        $employeeRole = CompanyRole::create([
            'name' => 'HR',
        ]);

        $permissions = [
            'Create_Job',
            'Edit_Job',
            'Delete_Job',
            'View_Job',
            'Manage_Users',
            'Assign_Roles',
            'Read_Applicants',
            'Approve_Applicants',
            'Reject_Applicants',
            'View_Company_Details',
            'Manage_Company_Profile',
        ];

        $permissionModels = [];
        foreach ($permissions as $permission) {
            $permissionModels[$permission] = CompanyPermission::create([
                'name' => $permission,
            ]);
        }

        // Assign permissions to Admin role
        foreach ($permissionModels as $permission) {
            CompanyRolesPermission::create([
                'c_role_id' => $adminRole->id,
                'c_permission_id' => $permission->id,
            ]);
        }

        $managerPermissions = [
            'Create_Job',
            'Edit_Job',
            'View_Job',
            'Manage_Users',
            'Read_Applicants',
            'Approve_Applicants',
            'Reject_Applicants',
        ];

        foreach ($managerPermissions as $permission) {
            CompanyRolesPermission::create([
                'c_role_id' => $managerRole->id,
                'c_permission_id' => $permissionModels[$permission]->id,
            ]);
        }

        $employeePermissions = [
            'View_Job',
            'Read_Applicants',
        ];

        foreach ($employeePermissions as $permission) {
            CompanyRolesPermission::create([
                'c_role_id' => $employeeRole->id,
                'c_permission_id' => $permissionModels[$permission]->id,
            ]);
        }

        $this->command->info('Company roles and permissions seeded!');
    }
}
