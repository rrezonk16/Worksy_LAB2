<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class JobDetail extends Model
{
    use HasFactory;

    protected $fillable = [
        'job_id',
        'wage',
        'location',
        'employment_type',
        'experience_level',
        'hashtags',
        'benefits',
        'deadline',
        'country_id',
        'city_id',
    ];

    protected $casts = [
        'hashtags' => 'array',
        'benefits' => 'array',
        'deadline' => 'date',
    ];

    public function job()
    {
        return $this->belongsTo(Job::class);
    }

    public function country()
    {
        return $this->belongsTo(Country::class);
    }

    public function city()
    {
        return $this->belongsTo(City::class);
    }
}
