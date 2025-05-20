<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JobApplication extends Model
{
    protected $fillable = ['job_id', 'user_id', 'status'];

    public function job()
    {
        return $this->belongsTo(Job::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
public function interview()
{
    return $this->hasOne(Interview::class);
}

    public function answers()
    {
        return $this->hasMany(JobApplicationAnswer::class);
    }
}
