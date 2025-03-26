<?php

namespace App\Http\Controllers\Auth;

use App\Models\User;
use App\Models\Role;
use App\Models\Permission;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use App\Models\UserDetail;

class UserController extends Controller
{

    //register job seeker
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'surname' => 'required|string|max:255',
            'birthday' => 'required|date',
            'phone_number' => 'required|string|max:15',
            'gender' => 'required|string|in:male,female,other',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $roleId = 1;

        $user = User::create([
            'name' => $request->name,
            'surname' => $request->surname,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'phone_number' => $request->phone_number,
            'role_id' => $roleId, // Assign role_id = 1
        ]);

        $userDetail = UserDetail::create([
            'user_id' => $user->id,
            'birthday' => $request->birthday,
            'gender' => $request->gender,
            'profile_image' => $request->profile_image ?? null,
            'bio' => $request->bio ?? null,
            'skills_tag' => $request->skills_tag ?? null,
            'resume_link_to_file' => $request->resume_link_to_file ?? null,
            'social_links' => $request->social_links ?? null,
        ]);

        $token = $user->createToken('Worksy')->plainTextToken;

        return response()->json([
            'message' => 'User registered successfully!',
            'token' => $token,
            'user' => $user,
            'user_detail' => $userDetail,
        ], 201);
    }
    public function updateUserDetails(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'birthday' => 'nullable|date',
            'gender' => 'nullable|string|in:male,female,other',
            'profile_image' => 'nullable|string',
            'bio' => 'nullable|string|max:500',
            'skills_tag' => 'nullable|string|max:255',
            'resume_link_to_file' => 'nullable|string|url',
            'social_links' => 'nullable|array',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = Auth::user();

        $userDetail = UserDetail::updateOrCreate(
            ['user_id' => $user->id],
            [
                'birthday' => $request->birthday ?? $user->details->birthday,
                'gender' => $request->gender ?? $user->details->gender,
                'profile_image' => $request->profile_image ?? $user->details->profile_image,
                'bio' => $request->bio ?? $user->details->bio,
                'skills_tag' => $request->skills_tag ?? $user->details->skills_tag,
                'resume_link_to_file' => $request->resume_link_to_file ?? $user->details->resume_link_to_file,
                'social_links' => $request->social_links ?? $user->details->social_links,
            ]
        );

        return response()->json([
            'message' => 'User details updated successfully!',
            'user_detail' => $userDetail,
        ], 200);
    }


    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|string|min:8',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $credentials = $request->only('email', 'password');

        if (Auth::attempt($credentials)) {
            $user = Auth::user();
            $token = $user->createToken('Worksy')->plainTextToken;

            $permissions = $user->role->permissions->pluck('name');

            return response()->json([
                'message' => 'Login successful!',
                'token' => $token,
                'user' => [
                    'name' => $user->name,
                    'surname' => $user->surname,
                    'email' => $user->email,
                ],
                'permissions' => $permissions,
            ]);
        } else {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
    }

    public function getMyPermissions()
    {
        $user = Auth::user();

        $permissions = $user->role->permissions->pluck('name');

        return response()->json([
            'message' => 'Permissions retrieved successfully!',
            'permissions' => $permissions
        ], 200);
    }

    public function getAllUsers()
    {
        $user = Auth::user();

        $hasPermission = $user->role->permissions()->where('name', 'READ_USERS')->exists();

        if (!$hasPermission) {
            return response()->json(['message' => 'Forbidden: You do not have permission to view users.'], 403);
        }

        $users = User::with(['role', 'details'])->get();

        return response()->json([
            'message' => 'Users retrieved successfully!',
            'users' => $users
        ], 200);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out successfully!'], 200);
    }

    public function updateUser(Request $request, $id)
    {
        $user = Auth::user();

        $hasPermission = $user->role->permissions()->where('name', 'EDIT_USERS')->exists();

        if (!$hasPermission) {
            return response()->json(['message' => 'Forbidden: You do not have permission to edit users.'], 403);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'nullable|string|max:255',
            'surname' => 'nullable|string|max:255',
            'email' => 'nullable|email|unique:users,email,' . $id,
            'phone_number' => 'nullable|string|max:15',
            'role_id' => 'nullable|exists:roles,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $userToUpdate = User::find($id);

        if (!$userToUpdate) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $userToUpdate->update($request->only(['name', 'surname', 'email', 'phone_number', 'role_id']));

        return response()->json([
            'message' => 'User updated successfully!',
            'user' => $userToUpdate
        ], 200);
    }

    public function softDeleteUser($id)
    {
        $user = Auth::user();

        $hasPermission = $user->role->permissions()->where('name', 'DELETE_USERS')->exists();

        if (!$hasPermission) {
            return response()->json(['message' => 'Forbidden: You do not have permission to delete users.'], 403);
        }

        $userToDelete = User::find($id);

        if (!$userToDelete) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $userToDelete->delete();

        return response()->json(['message' => 'User soft deleted successfully!'], 200);
    }
    
    public function updateMyUserData(Request $request)
{
    $user = Auth::user(); 

    $validator = Validator::make($request->all(), [
        'name' => 'nullable|string|max:255',
        'surname' => 'nullable|string|max:255',
        'email' => 'nullable|email|unique:users,email,' . $user->id,
        'phone_number' => 'nullable|string|max:15',
        'password' => 'nullable|string|min:8|confirmed',
    ]);

    if ($validator->fails()) {
        return response()->json(['errors' => $validator->errors()], 422);
    }

    $user->update([
        'name' => $request->name ?? $user->name,
        'surname' => $request->surname ?? $user->surname,
        'email' => $request->email ?? $user->email,
        'phone_number' => $request->phone_number ?? $user->phone_number,
        'password' => $request->password ? Hash::make($request->password) : $user->password,
    ]);

    return response()->json([
        'message' => 'User data updated successfully!',
        'user' => $user
    ], 200);
}

}
