<?php

namespace App\Http\Controllers;

use App\Mail\InterviewScheduledMail;
use App\Models\Application;
use App\Models\Interview;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Models\JobApplication;



class JobApplicationStatusController extends Controller
{
  public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:pending,interview,accepted',
        ]);

        $user = auth()->user();
        if (!$user || !$user->company_id) {
            return response()->json(['message' => 'Unauthorized or invalid company user.'], 403);
        }

        $application = JobApplication::with('job')->findOrFail($id);

        if ($application->job->company_id !== $user->company_id) {
            return response()->json(['message' => 'You do not have permission to update this application.'], 403);
        }

        $currentStatus = $application->status;
        $newStatus = $request->status;

        $validTransitions = [
            'pending' => 'interview',
            'interview' => 'accepted',
        ];

        if (!isset($validTransitions[$currentStatus]) || $validTransitions[$currentStatus] !== $newStatus) {
            return response()->json([
                'message' => "Invalid status transition from '$currentStatus' to '$newStatus'."
            ], 422);
        }

        $application->status = $newStatus;
        $application->save();

        return response()->json([
            'message' => 'Status updated successfully.',
            'application' => $application
        ]);
    }

  public function schedule(Request $request)
    {
        $request->validate([
            'application_id' => 'required|exists:applications,id',
            'date' => 'required|date',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
        ]);

        $application = JobApplication::with('user')->find($request->application_id);

        $interview = Interview::create([
            'application_id' => $application->id,
            'date' => $request->date,
            'start_time' => $request->start_time,
            'end_time' => $request->end_time,
        ]);

        // Optionally send email
        Mail::to($application->user->email)->send(new InterviewScheduledMail($interview));

        return response()->json([
            'message' => 'Interview scheduled successfully',
            'interview' => $interview,
        ], 201);
    }
}
