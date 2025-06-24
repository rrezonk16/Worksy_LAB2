<?php

namespace App\Http\Controllers;

use App\Models\Company;
use Illuminate\Http\Request;

class CompanyProfileController extends Controller
{
 public function getAllCompanies()
    {
        $companies = Company::with('users', 'roles', 'subscriptions', 'verifications', 'jobs')->get();

        return response()->json($companies);
    }

    public function getCompanyById($id)
    {
        $company = Company::with('users', 'roles', 'subscriptions', 'verifications', 'jobs')->find($id);

        if (!$company) {
            return response()->json(['message' => 'Company not found'], 404);
        }

        return response()->json($company);
    }
}
