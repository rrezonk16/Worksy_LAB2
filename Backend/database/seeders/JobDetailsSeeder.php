<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Job;
use App\Models\JobDetail;

class JobDetailsSeeder extends Seeder
{
    public function run()
    {
        $locations = ['Remote', 'On-Site', 'Hybrid', 'Flexible'];
        $employmentTypes = ['Full-Time', 'Part-Time', 'Internship'];
        $experienceLevels = ['Entry-level', 'Mid-level', 'Senior'];
        $hashtagsList = [
            ['software', 'backend', 'api'], ['management', 'agile', 'scrum'],
            ['design', 'ux', 'ui'], ['testing', 'qa', 'automation'],
            ['cloud', 'devops', 'docker'], ['data', 'analytics', 'sql'],
            ['security', 'network', 'cyber'], ['mobile', 'android', 'ios'],
            ['sysadmin', 'linux', 'servers'], ['html', 'css', 'javascript']
        ];
        $benefitsList = [
            ['healthcare', 'retirement'], ['remote work', 'bonuses'],
            ['paid leave', 'flex time'], ['gym membership', 'training'],
            ['stock options', 'equipment'], ['meal plans', 'travel allowance'],
            ['certifications', 'tools'], ['laptop', 'phone plan'],
            ['relocation', 'insurance'], ['team events', 'swag']
        ];

        $jobs = Job::all();

        foreach ($jobs as $job) {
            JobDetail::create([
                'job_id' => $job->id,
                'wage' => rand(1000, 4000),
                'location' => $locations[array_rand($locations)],
                'employment_type' => $employmentTypes[array_rand($employmentTypes)],
                'experience_level' => $experienceLevels[array_rand($experienceLevels)],
                'hashtags' => $hashtagsList[array_rand($hashtagsList)],
                'benefits' => $benefitsList[array_rand($benefitsList)],
                'deadline' => now()->addDays(rand(15, 60)),
                'country_id' => 3,
                'city_id' => rand(7, 25),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
