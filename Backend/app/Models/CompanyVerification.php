<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
class CompanyVerification extends Model
{
    use HasFactory;

    protected $fillable = [
        'company_id',
        'status',
        'company_certificate_url',
        'owner_id_front',
        'owner_id_back',
    ];

    public $timestamps = true; 

    protected $appends = ['created_at_formatted', 'updated_at_formatted'];

    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function getCreatedAtFormattedAttribute()
    {
        return $this->created_at->toDateTimeString(); 
    }

    public function getUpdatedAtFormattedAttribute()
    {
        return $this->updated_at->toDateTimeString();
    }
}
