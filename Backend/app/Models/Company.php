<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Company extends Model {
    use HasFactory;

    protected $fillable = [
        'name', 'nui', 'number_of_employees', 'email', 'city', 'country',
        'address', 'phone_number', 'njesite', 'activities', 'logo_url'
    ];
    

    protected $casts = [
        'njesite' => 'array',
        'activities' => 'array',
    ];

    public function users() {
        return $this->hasMany(CompanyUser::class);
    }

    public function roles() {
        return $this->hasMany(CompanyRole::class);
    }

    public function verifications() {
        return $this->hasOne(CompanyVerification::class);
    }
}
