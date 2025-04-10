<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JobQuestion extends Model
{
    protected $fillable = ['job_id', 'question_text', 'input_type', 'is_required'];

    public function job()
    {
        return $this->belongsTo(Job::class);
    }

    public function options()
    {
        return $this->hasMany(JobQuestionOption::class);
    }
}

