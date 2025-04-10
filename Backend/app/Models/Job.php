<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Job extends Model
{
    protected $fillable = ['title', 'description', 'company_id'];

    public function company()
    {
        return $this->belongsTo(User::class, 'company_id');
    }

    public function questions()
    {
        return $this->hasMany(JobQuestion::class);
    }

    public function applications()
    {
        return $this->hasMany(JobApplication::class);
    }
}
