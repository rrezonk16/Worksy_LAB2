<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    public function run()
    {
        Role::create([
            'name' => 'admin',
        ]);

        Role::create([
            'name' => 'job_seeker',
        ]);

        Role::create([
            'name' => 'individual_employer',
        ]);
    }
}
