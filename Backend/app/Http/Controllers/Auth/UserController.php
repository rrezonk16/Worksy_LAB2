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
    // Register a new user
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'surname' => 'required|string|max:255',
            'birthday' => 'required|date', // Add validation for birthday
            'phone_number' => 'required|string|max:15', // Validate phone number
            'gender' => 'required|string|in:male,female,other', // Validate gender (you can adjust this as per your needs)
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
            'role_id' => 'required|exists:roles,id', // Ensure the role exists in the roles table
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Create the user
        $user = User::create([
            'name' => $request->name,
            'surname' => $request->surname,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'phone_number' => $request->phone_number, // Save phone number
            'role_id' => $request->role_id,
        ]);

        // Create the user details entry
        $userDetail = UserDetail::create([
            'user_id' => $user->id,
            'birthday' => $request->birthday, // Save birthday
            'gender' => $request->gender, // Save gender
            'profile_image' => $request->profile_image, // Optional: You can handle this in case it's provided
            'bio' => $request->bio, // Optional: Handle bio if provided
            'skills_tag' => $request->skills_tag, // Optional: Handle skills tag if provided
            'resume_link_to_file' => $request->resume_link_to_file, // Optional: Handle resume link if provided
            'social_links' => $request->social_links, // Optional: Handle social links if provided
        ]);

        // Generate a token for the user
        $token = $user->createToken('Worksy')->plainTextToken;

        return response()->json([
            'message' => 'User registered successfully!',
            'token' => $token,
            'user' => $user,
            'user_detail' => $userDetail, // Return the user details
        ], 201);
    }
    // Login a user and return a token with permissions
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
            // Generate a token for the user
            $token = $user->createToken('Worksy')->plainTextToken;

            // Fetch permissions for the user's role
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
}
