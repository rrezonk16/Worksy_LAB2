<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JobApplicationAnswer extends Model
{
    protected $fillable = ['job_application_id', 'job_question_id', 'answer'];

    public function application()
    {
        return $this->belongsTo(JobApplication::class);
    }

    public function question()
    {
        return $this->belongsTo(JobQuestion::class);
    }
}
