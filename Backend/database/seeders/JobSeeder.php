<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Job;

class JobSeeder extends Seeder
{
    public function run()
    {
        $titles = [
            'Software Engineer',
            'Project Manager',
            'UI/UX Designer',
            'QA Tester',
            'DevOps Engineer',
        ];

        foreach ($titles as $title) {
            Job::create([
                'title' => $title,
                'description' => "We're hiring a {$title} to join our amazing team.",
                'company_id' => rand(1, 5),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}

