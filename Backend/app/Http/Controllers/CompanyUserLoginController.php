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
    
        // Retrieve the company verification status
        $companyVerification = $companyUser->company->verifications;  // Access verification status via company
    
        // If verification exists, get the status, otherwise null
        $verificationStatus = $companyVerification ? $companyVerification->status : null;
    
        $token = $companyUser->createToken('CompanyUserToken')->plainTextToken;
    
        return response()->json([
            'message' => 'Login successful',
            'token' => $token,
            'user' => $companyUser,
            'company_verification_status' => $verificationStatus,  // Return the verification status
        ], 200);
    }
    
    
}
