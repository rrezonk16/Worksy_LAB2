<?php

namespace App\Http\Controllers\Auth;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Http\Request;
use App\Models\User;
use App\Http\Controllers\Controller;
use App\Mail\ResetCodeMail;
use Illuminate\Support\Facades\DB;

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
    
        DB::table('password_resets')->updateOrInsert(
            ['email' => $request->email],
            ['code' => $code, 'created_at' => now(), 'updated_at' => now()]
        );
    
        // Send code via mail
        Mail::to($request->email)->send(new ResetCodeMail($code));
    
        return response()->json(['message' => 'Code sent to email.']);
    }
    
    public function verifyCode(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'code' => 'required|string',
        ]);
    
        $reset = DB::table('password_resets')
            ->where('email', $request->email)
            ->first();
    
        if (!$reset || $reset->code !== $request->code) {
            return response()->json(['message' => 'Invalid code.'], 400);
        }
    
        return response()->json(['message' => 'Code verified.'], 200);
    }
    


    public function resetPassword(Request $request)
{
    $request->validate([
        'email' => 'required|email',
        'code' => 'required|string',
        'password' => 'required|confirmed|min:6',
    ]);

    $reset = DB::table('password_resets')
        ->where('email', $request->email)
        ->first();

    if (!$reset || $reset->code !== $request->code) {
        return response()->json(['message' => 'Invalid code.'], 400);
    }

    $user = User::where('email', $request->email)->first();
    if (!$user) {
        return response()->json(['message' => 'User not found.'], 404);
    }

    $user->password = Hash::make($request->password);
    $user->save();

    DB::table('password_resets')->where('email', $request->email)->delete();

    return response()->json(['message' => 'Password reset successfully.']);
}

}
