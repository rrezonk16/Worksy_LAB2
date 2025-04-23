<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Job;
use App\Models\Company;

class JobSeeder extends Seeder
{
    public function run()
    {
        // Assuming you have a Company model with companies already in the database
        $company = Company::first(); // Get the first company (or create your own logic to get a specific company)

        Job::create([
            'title' => 'Software Engineer',
            'description' => 'We are looking for a passionate software engineer to join our team.',
            'company_id' => $company->id,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        Job::create([
            'title' => 'Project Manager',
            'description' => 'Join our team as a project manager to oversee our technical projects.',
            'company_id' => $company->id,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
