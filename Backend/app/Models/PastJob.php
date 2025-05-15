<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PastJob extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'job_title',
        'company_name',
        'city',
        'job_type',
        'start_date',
        'end_date',
        'description',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
