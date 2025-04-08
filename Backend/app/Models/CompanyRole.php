<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CompanyRole extends Model {
    use HasFactory;

    protected $fillable = ['name', 'company_id'];

    public function company() {
        return $this->belongsTo(Company::class);
    }

    public function permissions() {
        return $this->belongsToMany(CompanyPermission::class, 'company_roles_permissions', 'c_role_id', 'c_permission_id');
    }
}
