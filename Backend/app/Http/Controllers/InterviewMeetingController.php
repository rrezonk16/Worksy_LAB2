<?php

namespace App\Http\Controllers;

use App\Models\InterviewMeeting;
use App\Models\JobApplication;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use App\Mail\InterviewMeetingInvitation;
use Carbon\Carbon;

class InterviewMeetingController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'job_application_id' => 'required|exists:job_applications,id',
            'scheduled_at' => 'required|date',
        ]);

        $roomName = 'interview-' . Str::uuid();

        $meeting = InterviewMeeting::create([
            'job_application_id' => $request->job_application_id,
            'room_name' => $roomName,
            'scheduled_at' => Carbon::parse($request->scheduled_at),
        ]);

        $application = $meeting->jobApplication()->with('user')->first();

        Mail::to($application->user->email)->queue(new InterviewMeetingInvitation($meeting));

        return response()->json([
            'message' => 'Interview meeting scheduled and invitation sent.',
            'roomName' => $roomName,
            'scheduledAt' => $meeting->scheduled_at,
        ]);
    }

    public function getByApplicationId($application_id)
{
    $meeting = InterviewMeeting::where('job_application_id', $application_id)->first();

    if (!$meeting) {
        return response()->json(['message' => 'Meeting not found.'], 404);
    }

    return response()->json($meeting);
}

}
