<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;

class CompanyUser extends Model {
    use HasFactory, HasApiTokens;

    protected $fillable = [
        'name', 'surname', 'username', 'password', 'company_id', 'position', 'company_role_id'
    ];

    protected $hidden = ['password'];

    public function company() {
        return $this->belongsTo(Company::class);
    }

    public function role() {
        return $this->belongsTo(CompanyRole::class, 'company_role_id');
    }
    
}
