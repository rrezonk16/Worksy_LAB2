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
            'status' => "pending" , 
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
