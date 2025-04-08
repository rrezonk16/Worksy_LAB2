<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\UserDetail;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run()
    {
        $user = User::create([
            'name' => 'Admin',
            'surname' => 'User',
            'email' => 'admin@example.com',
            'password' => Hash::make('adminpassword'), 
            'phone_number' => '1234567890',
            'role_id' => 1, 
        ]);

        UserDetail::create([
            'user_id' => $user->id,
            'birthday' => '1990-01-01', 
            'gender' => 'male', 
            'profile_image' => 'profile_image_url_here',
            'bio' => 'This is the bio for the admin user.',
            'skills_tag' => 'Management, Leadership', 
            'resume_link_to_file' => 'resume_link_here',
            'social_links' => 'facebook.com/admin',
        ]);

        $this->command->info('Admin user seeded!');
    }
}
