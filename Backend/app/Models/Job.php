<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Job extends Model
{
    protected $fillable = ['title', 'description', 'company_id'];

    public function company()
    {
        return $this->belongsTo(Company::class, 'company_id');
    }
    

    public function questions()
    {
        return $this->hasMany(JobQuestion::class);
    }

    public function applications()
    {
        return $this->hasMany(JobApplication::class);
    }
    public function details()
{
    return $this->hasOne(JobDetail::class);
}

public function show($id)
{
    $job = Job::find($id);

    if (!$job) {
        abort(404, "Job not found");
    }

    return view('share.job', ['job' => $job]);
}

}
