<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class UserDetail extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'birthday',
        'profile_image',
        'bio',
        'skills_tag',
        'resume_link_to_file',
        'social_links',
        'gender',
    ];

    protected $casts = [
        'social_links' => 'array',
    ];

    // Relationship with User
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Accessor to get the full URL of the profile image
    public function getProfileImageAttribute($value)
    {
        return $value ? url('storage/profile_images/' . $value) : null;
    }
}
