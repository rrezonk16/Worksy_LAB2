<?php
namespace App\Http\Controllers\Company;
use App\Http\Controllers\Controller;

use App\Models\Company;
use App\Models\CompanyUser;
use App\Models\CompanyRole;
use App\Models\CompanyVerification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class CompanyController extends Controller
{
    public function register(Request $request)
    {
        // Validate incoming request
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'nui' => 'required|string|max:255',
            'phone_number' => 'required|string|max:15',
            'email' => 'required|email|unique:companies,email', // Validate email
            'password' => 'required|string|min:8|confirmed', // Validate password
        ]);
    
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
    
        // Step 1: Create the company record (no password field)
        $company = Company::create([
            'name' => $request->name,
            'nui' => $request->nui,
            'phone_number' => $request->phone_number,
            'email' => $request->email,
        ]);
    
        // Step 2: Create the admin user for the company
        $companyUser = CompanyUser::create([
            'name' => $request->name . '_Admin',
            'surname' => 'Admin',
            'username' => strtolower($request->name) . '_admin',
            'password' => bcrypt($request->password), // Password for the admin user
            'company_id' => $company->id,
            'company_role_id' => 1, // Set role_id to 1 (assuming this is the admin role)
            'position' => 'admin', // Set the position to admin
        ]);
    
        // Step 3: Create a verification record for the company (status 0 for pending)
        CompanyVerification::create([
            'company_id' => $company->id,
            'status' => 0, // Pending verification
            'certificate_image_url' => null, // If applicable, add the image URL
            'owner_id_front' => null, // If applicable, add the front image
            'owner_id_back' => null, // If applicable, add the back image
        ]);
    
        // Return success response
        return response()->json([
            'message' => 'Company and admin user created successfully!',
            'company' => $company,
            'company_user' => $companyUser,
        ]);
    }
    
}
