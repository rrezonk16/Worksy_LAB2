<?php

namespace Database\seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Job;
use App\Models\JobDetail;

class JobDetailsSeeder extends Seeder
{
    public function run()
    {
        $job = Job::first(); 

        JobDetail::create([
            'job_id' => $job->id,
            'wage' => 3000,
            'location' => 'Prishtina',
            'employment_type' => 'Full-Time',
            'experience_level' => 'Mid-level',
            'hashtags' => ['software', 'engineering', 'developer'],
          'benefits' => ['healthcare', 'retirement'],

            'deadline' => now()->addDays(30),
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        
    }
}
