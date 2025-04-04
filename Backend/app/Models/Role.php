<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    use HasFactory;

    // Define the relationship with the Permission model
    public function permissions()
    {
        return $this->belongsToMany(Permission::class, 'role_permission');
    }

    // Manually assign a permission to this role
    public function givePermissionTo(Permission $permission)
    {
        $this->permissions()->attach($permission);
    }

    // Sync multiple permissions
    public function syncPermissions($permissions)
    {
        // Sync permissions - accepts an array of permission IDs or a collection of Permission models
        $this->permissions()->sync($permissions);
    }
}
