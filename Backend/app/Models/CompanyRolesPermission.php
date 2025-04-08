<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CompanyRolesPermission extends Model {
    use HasFactory;

    protected $fillable = ['c_role_id', 'c_permission_id'];
}
