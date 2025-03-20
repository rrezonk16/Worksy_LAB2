<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    public function run()
    {
        // Create the 'admin' role
        Role::create([
            'name' => 'admin',
        ]);
    }
}
