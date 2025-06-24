<?php

namespace App\Http\Controllers\Company;

use App\Http\Controllers\Controller;
use App\Models\CompanySubscription;

use App\Models\Company;
use App\Models\CompanyUser;
use App\Models\CompanyRole;
use App\Models\CompanyVerification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class CompanyController extends Controller
{


public function index()
{
    $companies = Company::with(['users', 'verifications', 'roles'])->get();

    $companies->each(function ($company) {
        if ($company->verifications) {
            $company->verifications->company_certificate_url = $company->verifications->company_certificate_url
                ? 'http://localhost:8000/storage/' . ltrim($company->verifications->company_certificate_url, '/')
                : null;

            $company->verifications->owner_id_front = $company->verifications->owner_id_front
                ? 'http://localhost:8000/storage/' . ltrim($company->verifications->owner_id_front, '/')
                : null;

            $company->verifications->owner_id_back = $company->verifications->owner_id_back
                ? 'http://localhost:8000/storage/' . ltrim($company->verifications->owner_id_back, '/')
                : null;
        }
    });

    return response()->json([
        'companies' => $companies,
    ]);
}



    public function show($id)
    {
        $company = Company::with(['users', 'verifications', 'roles'])->find($id);

        if (!$company) {
            return response()->json(['error' => 'Company not found'], 404);
        }

        $subscription = CompanySubscription::where('company_id', $company->id)->first();

        return response()->json([
            'company' => $company,
            'subscription' => $subscription,
        ]);
    }

    public function update(Request $request, $id)
    {
        $company = Company::find($id);

        if (!$company) {
            return response()->json(['error' => 'Company not found'], 404);
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'nui' => 'sometimes|string|max:255',
            'number_of_employees' => 'nullable|integer',
            'email' => 'sometimes|email|unique:companies,email,' . $company->id,
            'city' => 'nullable|string|max:255',
            'country' => 'nullable|string|max:255',
            'address' => 'nullable|string|max:255',
            'phone_number' => 'nullable|string|max:20',
            'njesia' => 'nullable|array',
            'activities' => 'nullable|array',
        ]);

        $company->update($validated);

        return response()->json([
            'message' => 'Company updated successfully',
            'company' => $company,
        ]);
    }

    public function destroy($id)
    {
        $company = Company::find($id);

        if (!$company) {
            return response()->json(['error' => 'Company not found'], 404);
        }

        $company->delete();

        return response()->json(['message' => 'Company deleted successfully']);
    }

    public function uploadLogo(Request $request)
    {
        $request->validate([
            'logo' => 'required|image|mimes:jpeg,jpg,png|max:2048',
        ]);

        $user = Auth::user();
        $company = $user->company;

        if ($request->hasFile('logo')) {
            if ($company->logo_url && Storage::disk('public')->exists(str_replace('/storage/', '', $company->logo_url))) {
                Storage::disk('public')->delete(str_replace('/storage/', '', $company->logo_url));
            }
            $path = $request->file('logo')->store('logos', 'public');

            $company->logo_url = '/storage/' . $path;
            $company->save();
        }

        return response()->json([
            'message' => 'Logo uploaded successfully.',
            'logo_url' => $company->logo_url,
        ]);
    }

    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'nui' => 'required|string|max:255',
            'phone_number' => 'required|string|max:15',
            'email' => 'required|email|unique:companies,email',
            'password' => 'required|string|min:8|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $company = Company::create([
            'name' => $request->name,
            'nui' => $request->nui,
            'phone_number' => $request->phone_number,
            'email' => $request->email,
        ]);

        $companyUser = CompanyUser::create([
            'name' => $request->name . '_Admin',
            'surname' => 'Admin',
            'username' => strtolower($request->name) . '_admin',
            'password' => bcrypt($request->password),
            'company_id' => $company->id,
            'company_role_id' => 1,
            'position' => 'admin',
        ]);

        CompanyVerification::create([
            'company_id' => $company->id,
            'status' => "pending",
            'certificate_image_url' => null,
            'owner_id_front' => null,
            'owner_id_back' => null,
        ]);

        return response()->json([
            'message' => 'Company and admin user created successfully!',
            'company' => $company,
            'company_user' => $companyUser,
        ]);
    }
}
