<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\CompanySubscription;
use App\Mail\WelcomePremiumSubscriber;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Carbon\Carbon;

class SubscriptionController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'subscription_type' => 'required|string|in:Standard,Premium',
            'duration_days' => 'required|integer|min:1',
        ]);

        $user = Auth::user();

        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        if (!$user->company_id) {
            return response()->json(['error' => 'No company associated with the user'], 403);
        }

        $company = Company::find($user->company_id);

        if (!$company) {
            return response()->json(['error' => 'Company not found'], 404);
        }

        $existingSubscription = CompanySubscription::where('company_id', $company->id)->first();
        if ($existingSubscription) {
            return response()->json(['error' => 'The company is already subscribed.'], 400);
        }

        try {
            $startDate = Carbon::now();
            $endDate = $startDate->copy()->addDays($validated['duration_days']);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error calculating dates'], 500);
        }

        try {
            CompanySubscription::create([
                'company_id' => $company->id,
                'subscription_type' => $validated['subscription_type'],
                'start_date' => $startDate->toDateString(),
                'end_date' => $endDate->toDateString(),
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to create subscription. ' . $e->getMessage()], 500);
        }

        try {
            $companyEmail = $company->email;
            Mail::to($companyEmail)->send(new WelcomePremiumSubscriber($company->name, $startDate->toDateString(), $validated['subscription_type']));
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to send welcome email. ' . $e->getMessage()], 500);
        }

        return response()->json(['message' => 'Subscription activated successfully.'], 200);
    }
}
