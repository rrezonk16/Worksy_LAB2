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
}
