<?php

namespace App\Models;


use Illuminate\Database\Eloquent\Model;

class InterviewMeeting extends Model
{
    protected $fillable = ['job_application_id', 'room_name', 'scheduled_at'];

    public function jobApplication()
    {
        return $this->belongsTo(JobApplication::class);
    }
    
}
