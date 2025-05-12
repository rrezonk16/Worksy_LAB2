<?php

namespace App\Http\Controllers;

use App\Models\Role;
use App\Models\Permission;
use App\Models\User;
use Illuminate\Http\Request;

class RolePermissionController extends Controller
{

    public function createRole(Request $request)
    {
        $request->validate(['name' => 'required|string|unique:roles,name']);
        $role = Role::create(['name' => $request->name]);
        return response()->json(['message' => 'Role created', 'role' => $role]);
    }
    public function assignPermissionsToRole(Request $request, $roleId)
    {
        $request->validate(['permission_ids' => 'required|array']);
        $role = Role::findOrFail($roleId);
        $role->syncPermissions($request->permission_ids);
        return response()->json(['message' => 'Permissions updated']);
    }
    public function getPermissionsForRole($roleId)
    {
        $role = Role::findOrFail($roleId);
        return response()->json(['permissions' => $role->permissions]);
    }
    public function getUserRole($userId)
    {
        $user = User::findOrFail($userId);
        return response()->json(['role' => $user->roles->first()]);
    }
    public function assignRoleToUser(Request $request, $userId)
    {
        $request->validate([
            'role_id' => 'required|exists:roles,id'
        ]);
    
        $user = User::findOrFail($userId);
        $user->role_id = $request->role_id;
        $user->save();
    
        return response()->json(['message' => 'Role assigned']);
    }
    

    public function getPermissions()
    {
        $permissions = Permission::all();

        return response()->json(['permissions' => $permissions]);
    }
    public function getRoles()
    {
        $roles = Role::all();
        return response()->json(['roles' => $roles]);
    }
public function getMyPermissions()
{
    $user = auth()->user();

    if (!$user || !$user->role) {
        return response()->json(['message' => 'No role assigned or unauthenticated.'], 403);
    }

    $permissions = $user->role->permissions->pluck('name');

    return response()->json([
        'permissions' => $permissions
    ]);
}

}
