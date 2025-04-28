<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Job;
use App\Models\JobDetail;

class JobDetailsSeeder extends Seeder
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

        $locations = ['Prishtina', 'Gjakova', 'Peja', 'Ferizaj', 'Mitrovica'];
        $employmentTypes = ['Full-Time', 'Part-Time', 'Internship'];
        $experienceLevels = ['Entry-level', 'Mid-level', 'Senior'];
        $hashtags = [
            ['software', 'backend', 'api'],
            ['management', 'agile', 'scrum'],
            ['design', 'ux', 'ui'],
            ['testing', 'qa', 'automation'],
            ['cloud', 'devops', 'docker']
        ];
        $benefits = [
            ['healthcare', 'retirement'],
            ['remote work', 'bonuses'],
            ['paid leave', 'flex time'],
            ['gym membership', 'training'],
            ['stock options', 'equipment']
        ];

        foreach ($titles as $index => $title) {
            $job = Job::create([
                'title' => $title,
                'description' => "We're hiring a {$title} to join our team.",
                'company_id' => rand(1, 5),
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            JobDetail::create([
                'job_id' => $job->id,
                'wage' => rand(1000, 4000),
                'location' => $locations[$index],
                'employment_type' => $employmentTypes[array_rand($employmentTypes)],
                'experience_level' => $experienceLevels[array_rand($experienceLevels)],
                'hashtags' => $hashtags[$index],
                'benefits' => $benefits[$index],
                'deadline' => now()->addDays(rand(15, 60)),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
