<?php

namespace App\Http\Controllers;

use App\Models\CompanyVerification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CompanyVerificationController extends Controller
{
    public function applyForVerification(Request $request)
    {
        $companyUser = Auth::user();

        if (!$companyUser || !$companyUser->company) {
            return response()->json(['message' => 'Unauthorized or no associated company found'], 401);
        }

        $company = $companyUser->company;
        $verification = CompanyVerification::where('company_id', $company->id)->first();

        if ($verification && $verification->status !== 'pending') {
            return response()->json(['message' => 'You cannot apply for verification at this stage.'], 400);
        }

        $request->validate([
            'company_certificate' => 'required|mimes:jpeg,png,pdf,jpg|max:2048',
            'owner_id_front' => 'required|mimes:jpeg,png,pdf,jpg|max:2048',
            'owner_id_back' => 'required|mimes:jpeg,png,pdf,jpg|max:2048',
        ]);

        $certificatePath = $request->file('company_certificate')->store('company_verifications');
        $ownerIdFrontPath = $request->file('owner_id_front')->store('company_verifications');
        $ownerIdBackPath = $request->file('owner_id_back')->store('company_verifications');

        if ($verification) {
            $verification->update([
                'status' => 'uploaded',
                'company_certificate_url' => $certificatePath,
                'owner_id_front' => $ownerIdFrontPath,
                'owner_id_back' => $ownerIdBackPath,
            ]);
        } else {
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

    public function getCompanyVerification($companyId)
    {
        $verification = CompanyVerification::where('company_id', $companyId)->first();

        if (!$verification) {
            return response()->json(['message' => 'Verification record not found.'], 404);
        }

        return response()->json([
            'company_id' => $verification->company_id,
            'status' => $verification->status,
            'company_certificate_url' => asset("storage/{$verification->company_certificate_url}"),
            'owner_id_front' => asset("storage/{$verification->owner_id_front}"),
            'owner_id_back' => asset("storage/{$verification->owner_id_back}"),
        ], 200);
    }

    public function getCompanies()
    {
        $companies = CompanyVerification::all();

        return response()->json($companies, 200);
    }
   

    public function activateVerification($companyId)
    {
        $verification = CompanyVerification::where('company_id', $companyId)->first();

        if (!$verification) {
            return response()->json(['message' => 'Verification record not found.'], 404);
        }

        $verification->update(['status' => 'approved']);

        return response()->json(['message' => 'Company verification approved successfully!'], 200);
    }

    public function refuseVerification($companyId)
    {
        $verification = CompanyVerification::where('company_id', $companyId)->first();

        if (!$verification) {
            return response()->json(['message' => 'Verification record not found.'], 404);
        }

        $verification->update(['status' => 'rejected']);

        return response()->json(['message' => 'Company verification refused.'], 200);
    }
}
