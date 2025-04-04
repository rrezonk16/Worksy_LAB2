<?php

namespace App\Http\Controllers;

use App\Models\UserDetail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;

class UserDetailController extends Controller
{
    public function updateProfileImage(Request $request)
    {
        // Check if profile_image is in the request
        if (!$request->hasFile('profile_image')) {
            return response()->json(['error' => 'No profile image uploaded.'], 400);
        }
    
        // Validate the request
        $validator = Validator::make($request->all(), [
            'profile_image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);
    
        // Check if validation fails
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
    
        // Get the currently authenticated user
        $user = Auth::user();
    
        // Get the user detail
        $userDetail = $user->details;
    
        // If no user details exist, create a new one
        if (!$userDetail) {
            $userDetail = new UserDetail();
            $userDetail->user_id = $user->id;
        }
    
        // Handle the file upload
        if ($request->hasFile('profile_image')) {
            // Get the uploaded file
            $file = $request->file('profile_image');
            
            // Generate a new filename using the original file extension
            $imageName = time() . '.' . $file->getClientOriginalExtension();
    
            // Store the image in the public storage
            $file->storeAs('public/profile_images', $imageName);
    
            // If there is an old image, delete it
            if ($userDetail->profile_image && Storage::exists('public/profile_images/' . $userDetail->profile_image)) {
                Storage::delete('public/profile_images/' . $userDetail->profile_image);
            }
    
            // Update the profile_image field in UserDetail
            $userDetail->profile_image = $imageName;
        }
    
        // Save the updated user details
        $userDetail->save();
    
        return response()->json(['message' => 'Profile image updated successfully!'], 200);
    }
    
}
