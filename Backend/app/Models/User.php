<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasApiTokens;

    protected $fillable = [
        'name',
        'surname',
        'email',
        'password',
        'phone_number',
        'role_id',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    public function details()
    {
        return $this->hasOne(UserDetail::class, 'user_id');
    }

    public function role()
    {
        return $this->belongsTo(Role::class);
    }
    public function jobApplications()
    {
        return $this->hasMany(\App\Models\JobApplication::class, 'user_id');
    }
    public function pastJobs()
    {
        return $this->hasMany(PastJob::class);
    }
}
