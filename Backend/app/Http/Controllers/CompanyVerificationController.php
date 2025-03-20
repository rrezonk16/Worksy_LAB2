<?php

namespace App\Http\Controllers;

use App\Models\CompanyVerification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class CompanyVerificationController extends Controller
{
    public function applyForVerification(Request $request)
    {
        // Get the authenticated company user
        $companyUser = Auth::user();

        if (!$companyUser || !$companyUser->company) {
            return response()->json(['message' => 'Unauthorized or no associated company found'], 401);
        }

        // Get the company instance
        $company = $companyUser->company;

        // Check if verification already exists
        $verification = CompanyVerification::where('company_id', $company->id)->first();

        if ($verification && $verification->status !== 'pending') {
            return response()->json(['message' => 'You cannot apply for verification at this stage.'], 400);
        }

        // Validate incoming request
        $validator = Validator::make($request->all(), [
            'company_certificate' => 'required|mimes:jpeg,png,pdf,jpg|max:2048', // File validation
            'owner_id_front' => 'required|mimes:jpeg,png,pdf,jpg|max:2048', // File validation
            'owner_id_back' => 'required|mimes:jpeg,png,pdf,jpg|max:2048', // File validation
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        // Upload the files
        $certificatePath = $request->file('company_certificate')->store('company_verifications');
        $ownerIdFrontPath = $request->file('owner_id_front')->store('company_verifications');
        $ownerIdBackPath = $request->file('owner_id_back')->store('company_verifications');

        if ($verification) {
            // Update existing verification
            $verification->update([
                'status' => 'uploaded',
                'company_certificate_url' => $certificatePath,
                'owner_id_front' => $ownerIdFrontPath,
                'owner_id_back' => $ownerIdBackPath,
            ]);
        } else {
            // Create a new verification entry
            $verification = CompanyVerification::create([
                'company_id' => $company->id,
                'status' => 'uploaded',
                'company_certificate_url' => $certificatePath,
                'owner_id_front' => $ownerIdFrontPath,
                'owner_id_back' => $ownerIdBackPath,
            ]);
        }

        return response()->json([
            'message' => 'Verification applied successfully',
            'verification' => $verification
        ], 200);
    }
}
