<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Events\UserNotification;

class NotificationController extends Controller
{
    public function sendNotification(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|integer',
            'message' => 'required|string',
        ]);

        // Fire the event to broadcast the notification to the user with ID
        event(new UserNotification($validated['user_id'], $validated['message']));

        return response()->json(['status' => 'Notification sent successfully']);
    }
}
