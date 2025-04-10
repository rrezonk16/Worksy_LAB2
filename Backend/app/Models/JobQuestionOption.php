<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JobQuestionOption extends Model
{
    protected $fillable = ['job_question_id', 'option_text'];

    public function question()
    {
        return $this->belongsTo(JobQuestion::class, 'job_question_id');
    }
}
