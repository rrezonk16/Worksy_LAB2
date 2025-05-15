<?php

namespace App\Http\Controllers;

use App\Models\PastJob;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class PastJobController extends Controller
{
    // Get all past jobs of the authenticated user
    public function index()
    {
        $user = Auth::user();
        $pastJobs = $user->pastJobs()->get();

        return response()->json([
            'past_jobs' => $pastJobs
        ], 200);
    }

    // Store a new past job for the authenticated user
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'job_title' => 'required|string|max:255',
            'company_name' => 'required|string|max:255',
            'city' => 'nullable|string|max:255',
            'job_type' => 'required|in:Internship,Full-Time,Part-Time,Contract,Freelance',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'description' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = Auth::user();

        $pastJob = new PastJob([
            'job_title' => $request->job_title,
            'company_name' => $request->company_name,
            'city' => $request->city,
            'job_type' => $request->job_type,
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
            'description' => $request->description,
        ]);

        $user->pastJobs()->save($pastJob);

        return response()->json(['message' => 'Past job added successfully!', 'past_job' => $pastJob], 201);
    }

    // Show a specific past job
    public function show($id)
    {
        $pastJob = PastJob::find($id);

        if (!$pastJob || $pastJob->user_id !== Auth::id()) {
            return response()->json(['error' => 'Past job not found or unauthorized'], 404);
        }

        return response()->json(['past_job' => $pastJob], 200);
    }

    // Update an existing past job
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'job_title' => 'required|string|max:255',
            'company_name' => 'required|string|max:255',
            'city' => 'nullable|string|max:255',
            'job_type' => 'required|in:Internship,Full-Time,Part-Time,Contract,Freelance',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'description' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $pastJob = PastJob::find($id);

        if (!$pastJob || $pastJob->user_id !== Auth::id()) {
            return response()->json(['error' => 'Past job not found or unauthorized'], 404);
        }

        $pastJob->update($request->all());

        return response()->json(['message' => 'Past job updated successfully!', 'past_job' => $pastJob], 200);
    }

    // Delete a specific past job
    public function destroy($id)
    {
        $pastJob = PastJob::find($id);

        if (!$pastJob || $pastJob->user_id !== Auth::id()) {
            return response()->json(['error' => 'Past job not found or unauthorized'], 404);
        }

        $pastJob->delete();

        return response()->json(['message' => 'Past job deleted successfully!'], 200);
    }

    public function getByUserId($userId)
{
    $user = User::find($userId);

    if (!$user) {
        return response()->json(['error' => 'User not found'], 404);
    }

    $pastJobs = $user->pastJobs()->get();

    return response()->json([
        'user_id' => $userId,
        'past_jobs' => $pastJobs
    ], 200);
}

}
