<?php

namespace App\Http\Controllers\Auth;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Http\Request;
use App\Models\User;
use App\Http\Controllers\Controller;

class ForgotPasswordController extends Controller
{
    public function sendCode(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        $user = User::where('email', $request->email)->first();
        if (!$user) {
            return response()->json(['message' => 'User not found.'], 404);
        }

        $code = rand(100000, 999999);
        Cache::put("reset_code_{$user->email}", $code, now()->addMinutes(10));

        // Replace this with your actual Mail class to send the code
        Mail::raw("Your reset code is: $code", function ($message) use ($user) {
            $message->to($user->email)->subject('Password Reset Code');
        });

        return response()->json(['message' => 'Reset code sent to email.']);
    }

    public function resetPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'code' => 'required',
            'password' => 'required|confirmed|min:6',
        ]);

        $cachedCode = Cache::get("reset_code_{$request->email}");
        if ($cachedCode != $request->code) {
            return response()->json(['message' => 'Invalid or expired code.'], 400);
        }

        $user = User::where('email', $request->email)->first();
        if (!$user) {
            return response()->json(['message' => 'User not found.'], 404);
        }

        $user->password = Hash::make($request->password);
        $user->save();
        Cache::forget("reset_code_{$request->email}");

        return response()->json(['message' => 'Password changed successfully.']);
    }
}
