<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\Pivot;

class RolePermission extends Pivot
{
    use HasFactory;

    protected $table = 'role_permissions'; // Specify the pivot table name if it's different

    protected $fillable = [
        'role_id',
        'permission_id',
    ];
}
