<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\SubscriptionFeature;

class SubscriptionFeaturesSeeder extends Seeder
{
    public function run()
    {
        $features = [
            'job_custom_questions',
            'premium_job_posting',
            'highlighted_jobs',
            'unlimited_job_posts',
            'access_to_candidate_database',
            'priority_support',
            'company_profile_badge',
            'advanced_analytics',
        ];

        foreach ($features as $feature) {
            SubscriptionFeature::create([
                'name' => $feature,
            ]);
        }
    }
}
