<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Role;
use App\Models\Permission;

class RolePermissionSeeder extends Seeder
{
    public function run()
    {
        // Fetch roles
        $adminRole = Role::firstOrCreate(['name' => 'admin']);
        $jobSeekerRole = Role::firstOrCreate(['name' => 'job_seeker']);
        $employerRole = Role::firstOrCreate(['name' => 'individual_employer']);

        // Fetch permissions
        $permissions = Permission::pluck('id', 'name'); // Fetch all permissions

        // Assign permissions to admin (full access)
        $adminRole->syncPermissions($permissions->values());

        // Assign job seeker permissions
        $jobSeekerPermissions = [
            'APPLY_JOB',
            'VIEW_APPLICATIONS',
            'SEND_MESSAGE',
            'READ_MESSAGES',
            'WRITE_REVIEW',
        ];
        $jobSeekerRole->syncPermissions(array_values($permissions->only($jobSeekerPermissions)->toArray()));

        // Assign employer permissions
        $employerPermissions = [
            'POST_JOB',
            'EDIT_JOB',
            'DELETE_JOB',
            'VIEW_APPLICATIONS',
            'SHORTLIST_APPLICATION',
            'APPROVE_APPLICATION',
            'SEND_MESSAGE',
            'READ_MESSAGES',
        ];
        $employerRole->syncPermissions(array_values($permissions->only($employerPermissions)->toArray()));

        echo "Roles and permissions assigned successfully!\n";
    }
}
