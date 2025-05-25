<?php
namespace App\Http\Controllers;

use App\Mail\InterviewScheduledMail;
use App\Models\Application;
use App\Models\Interview;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Models\JobApplication;
use App\Events\JobAcceptedNotification;
use App\Events\StatusUpdatedNotification;
use App\Models\NotificationLog;
use Illuminate\Support\Facades\Log;
use Exception;

class JobApplicationStatusController extends Controller
{
    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:pending,interview,accepted',
        ]);

        try {
            $user = auth()->user();
            if (!$user || !$user->company_id) {
                return response()->json(['message' => 'Unauthorized or invalid company user.'], 403);
            }

            $application = JobApplication::with('job', 'user')->findOrFail($id);

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

            $message = "Your application for {$application->job->title} has been updated to '{$newStatus}'.";

            NotificationLog::create([
                'user_id' => $application->user_id,
                'message' => $message,
                'from_company' => $user->company->name ?? 'Unknown Company',
                'job_name' => $application->job->title,
            ]);

            event(new JobAcceptedNotification(
                $application->user_id,
                $message
            ));

            return response()->json([
                'message' => 'Status updated successfully.',
                'application' => $application
            ]);
        } catch (Exception $e) {
            Log::error('Update Status Error: ' . $e->getMessage(), ['exception' => $e]);
            return response()->json(['message' => 'Something went wrong while updating status.'], 500);
        }
    }

    public function schedule(Request $request)
    {
        $request->validate([
            'application_id' => 'required|exists:applications,id',
            'date' => 'required|date',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
        ]);

        try {
            $application = JobApplication::with('user')->find($request->application_id);

            $interview = Interview::create([
                'application_id' => $application->id,
                'date' => $request->date,
                'start_time' => $request->start_time,
                'end_time' => $request->end_time,
            ]);

            Mail::to($application->user->email)->send(new InterviewScheduledMail($interview));

            event(new StatusUpdatedNotification(
                $application->user_id,
                "Your interview has been scheduled for {$request->date} from {$request->start_time} to {$request->end_time}."
            ));

            return response()->json([
                'message' => 'Interview scheduled successfully',
                'interview' => $interview,
            ], 201);
        } catch (Exception $e) {
            Log::error('Interview Schedule Error: ' . $e->getMessage(), ['exception' => $e]);
            return response()->json(['message' => 'Something went wrong while scheduling the interview.'], 500);
        }
    }
}
