<?php


namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Interview extends Model
{
    protected $fillable = ['job_application_id', 'date', 'start_time', 'end_time'];

    public function jobApplication()
    {
        return $this->belongsTo(JobApplication::class);
    }
}
