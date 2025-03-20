<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    use HasFactory;

    // Define many-to-many relationship with permissions
    public function permissions()
    {
        return $this->belongsToMany(Permission::class, 'role_permission');
    }

    // Attach a permission to the role
    public function givePermissionTo(Permission $permission)
    {
        $this->permissions()->attach($permission);
    }
}
