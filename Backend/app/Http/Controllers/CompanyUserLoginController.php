<?php

namespace App\Http\Controllers;

use App\Models\CompanyUser;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class CompanyUserLoginController extends Controller
{
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'username' => 'required|string',
            'password' => 'required|string',
        ]);
    
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }
    
        $companyUser = CompanyUser::where('username', $request->username)->first();
    
        if (!$companyUser || !password_verify($request->password, $companyUser->password)) {
            return response()->json(['message' => 'Invalid username or password'], 401);
        }
    
        $companyVerification = $companyUser->company->verifications; 
    
        $verificationStatus = $companyVerification ? $companyVerification->status : null;
    
        $token = $companyUser->createToken('CompanyUserToken')->plainTextToken;
    
        return response()->json([
            'message' => 'Login successful',
            'token' => $token,
            'user' => $companyUser,
            'company_verification_status' => $verificationStatus,  // Return the verification status
        ], 200);
    }
    public function createUser(Request $request)
{
    $authUser = auth()->user();

    if (!$authUser || !$authUser->company_id) {
        return response()->json(['message' => 'Unauthorized or invalid company user.'], 403);
    }

    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'surname' => 'required|string|max:255',
        'username' => 'required|string|max:255|unique:company_users,username',
        'password' => 'required|string|min:6',
        'position' => 'nullable|string|max:255'
    ]);

    $user = CompanyUser::create([
        'name' => $validated['name'],
        'surname' => $validated['surname'],
        'username' => $validated['username'],
        'password' => bcrypt($validated['password']),
        'company_id' => $authUser->company_id,
        'position' => $validated['position'] ?? null,
        'company_role_id' => 1 // Set default role as 1
    ]);

    return response()->json([
        'message' => 'User created successfully.',
        'user' => $user
    ], 201);
}

    public function getAllUsers()
{
    $authUser = auth()->user();

    $users = CompanyUser::where('company_id', $authUser->company_id)->get();

    return response()->json(['users' => $users]);
}

public function updateUser(Request $request, $id)
{
    $authUser = auth()->user();
    $user = CompanyUser::where('id', $id)
        ->where('company_id', $authUser->company_id)
        ->firstOrFail();

    $validated = $request->validate([
        'name' => 'required|string',
        'surname' => 'required|string',
        'position' => 'nullable|string',
    ]);

    $user->update($validated);

    return response()->json(['message' => 'User updated successfully.', 'user' => $user]);
}

public function deleteUser($id)
{
    $authUser = auth()->user();
    $user = CompanyUser::where('id', $id)
        ->where('company_id', $authUser->company_id)
        ->firstOrFail();

    $user->delete();

    return response()->json(['message' => 'User deleted successfully.']);
}

public function changePassword(Request $request, $id)
{
    $authUser = auth()->user();
    $user = CompanyUser::where('id', $id)
        ->where('company_id', $authUser->company_id)
        ->firstOrFail();

    $request->validate([
        'password' => 'required|string|min:6',
    ]);

    $user->update(['password' => bcrypt($request->password)]);

    return response()->json(['message' => 'Password changed successfully.']);
}

public function getUserById($id)
{
    $authUser = auth()->user();
    $user = CompanyUser::where('id', $id)
        ->where('company_id', $authUser->company_id)
        ->firstOrFail();

    return response()->json(['user' => $user]); 


}

}