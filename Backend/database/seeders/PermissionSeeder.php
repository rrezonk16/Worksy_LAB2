<?php

namespace Database\Seeders;

use App\Models\Permission;
use Illuminate\Database\Seeder;

class PermissionSeeder extends Seeder
{
    public function run()
    {
        $permissions = [
            // User Management
            'READ_USERS',
            'EDIT_USERS',
            'ADD_USERS',
            'UPDATE_USERS',
            'DELETE_USERS',
            'BAN_USERS',

            // Job Management
            'POST_JOB',
            'EDIT_JOB',
            'DELETE_JOB',
            'APPROVE_JOB',
            'FEATURE_JOB',
            'ARCHIVE_JOB',

            // Application Management
            'APPLY_JOB',
            'VIEW_APPLICATIONS',
            'APPROVE_APPLICATION',
            'REJECT_APPLICATION',
            'SHORTLIST_APPLICATION',
            'DELETE_APPLICATION',

            // Company Management
            'CREATE_COMPANY',
            'UPDATE_COMPANY',
            'DELETE_COMPANY',
            'VERIFY_COMPANY',
            'MANAGE_COMPANY_USERS',
            'VIEW_COMPANY_REVIEWS',

            // Review & Feedback
            'WRITE_REVIEW',
            'DELETE_REVIEW',
            'APPROVE_REVIEW',
            'REPORT_REVIEW',

            // Messaging & Notifications
            'SEND_MESSAGE',
            'READ_MESSAGES',
            'DELETE_MESSAGES',
            'MANAGE_NOTIFICATIONS',

            // Subscription & Payments
            'MANAGE_SUBSCRIPTIONS',
            'PROCESS_PAYMENTS',
            'VIEW_BILLING_HISTORY',

            // Admin-Specific
            'ACCESS_DASHBOARD',
            'MANAGE_ROLES',
            'VIEW_REPORTS',
            'MANAGE_PERMISSIONS',
            'MANAGE_SETTINGS',
            'VIEW_AUDIT_LOGS',
            'MANAGE_BANNED_USERS',
            'OVERRIDE_DECISIONS',
            'VIEW_ALL_TRANSACTIONS',

            //LOGS
            'READ_LOGS',
            'DELETE_LOGS',
            'EXPORT_LOGS',
            'IMPORT_LOGS',
            'ARCHIVE_LOGS',
            'SEARCH_LOGS',
            'FILTER_LOGS',
            'ANALYZE_LOGS',
            'VIEW_LOG_DETAILS',
            'MANAGE_LOG_SETTINGS',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }
    }
}
