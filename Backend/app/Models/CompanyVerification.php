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

    // Define the relationship with the Company model
    public function company()
    {
        return $this->belongsTo(Company::class);
    }
}
