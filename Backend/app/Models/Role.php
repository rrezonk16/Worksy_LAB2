<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    use HasFactory;

    public function permissions()
    {
        return $this->belongsToMany(Permission::class, 'role_permission');
    }

    public function givePermissionTo(Permission $permission)
    {
        $this->permissions()->attach($permission);
    }

    public function syncPermissions($permissions)
    {
        $this->permissions()->sync($permissions);
    }
}
