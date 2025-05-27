<?php

namespace App\Http\Controllers;

use App\Models\UserDetail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
class UserDetailController extends Controller
{


public function updateProfileImage(Request $request)
{
    if (!$request->hasFile('profile_image')) {
        return response()->json(['error' => 'No profile image uploaded.'], 400);
    }

    $validator = Validator::make($request->all(), [
        'profile_image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
    ]);

    if ($validator->fails()) {
        return response()->json(['errors' => $validator->errors()], 422);
    }

    $user = Auth::user();
    $userDetail = $user->details;

    if (!$userDetail) {
        $userDetail = new UserDetail();
        $userDetail->user_id = $user->id;
    }

    if ($request->hasFile('profile_image')) {
        $file = $request->file('profile_image');

        $imageName = Str::uuid() . '.' . $file->getClientOriginalExtension();

        $file->storeAs('profile_images', $imageName);

        // Delete the old image if it exists
        if ($userDetail->profile_image && Storage::exists('profile_images/' . $userDetail->profile_image)) {
            Storage::delete('profile_images/' . $userDetail->profile_image);
        }

        $userDetail->profile_image = $imageName;
    }

    $userDetail->save();

    return response()->json([
        'message' => 'Profile image updated successfully!',
        'profile_image_url' => asset('storage/profile_images/' . $userDetail->profile_image)
    ], 200);
}


    public function updateProfileAndDetails(Request $request)
    {
        $user = Auth::user();

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255',
            'surname' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|max:255|unique:users,email,' . $user->id,
            'phone_number' => 'sometimes|string|max:20',

            'birthday' => 'sometimes|date',
            'bio' => 'sometimes|string|nullable',
            'skills_tag' => 'sometimes|string|nullable',
            'social_links' => 'sometimes|array|nullable',
            'gender' => 'sometimes|in:male,female,other',
            'resume_link_to_file' => 'sometimes|url|nullable',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user->update($request->only(['name', 'surname', 'email', 'phone_number']));

        $details = $user->details;
        if (!$details) {
            $details = new UserDetail(['user_id' => $user->id]);
        }

        $details->fill($request->only([
            'birthday',
            'bio',
            'skills_tag',
            'resume_link_to_file',
            'gender',
        ]));

        if ($request->has('social_links')) {
            $details->social_links = $request->input('social_links'); // should be an array
        }

        $details->save();

        return response()->json([
            'message' => 'Profile updated successfully.',
            'user' => $user->fresh('details')
        ]);
    }
}
