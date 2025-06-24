<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Job;

class JobSeeder extends Seeder
{
    public function run()
    {
        $titles = [
            'Software Engineer', 'Project Manager', 'UI/UX Designer', 'QA Tester', 'DevOps Engineer',
            'Data Analyst', 'Security Specialist', 'Mobile Developer', 'System Administrator', 'Frontend Developer',
            'Backend Developer', 'Cloud Engineer', 'Product Manager', 'Marketing Specialist', 'HR Coordinator',
            'Finance Analyst', 'Customer Support', 'Sales Representative', 'Business Analyst', 'Content Writer',
            'SEO Specialist', 'Tech Lead', 'Game Developer', 'Blockchain Engineer', 'AI Engineer',
            'Scrum Master', 'Office Manager', 'Recruiter', 'Legal Advisor', 'Technical Writer'
        ];

        foreach ($titles as $title) {
            Job::create([
                'title' => $title,
                'description' => "We're hiring a {$title} to join our amazing team.",
                'company_id' => rand(1, 7),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
