<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Pusher\Pusher;

class NotificationController extends Controller
{
    public function sendNotification(Request $request)
    {
        // Validate the incoming request
        $request->validate([
            'message' => 'required|string',
        ]);

        // Pusher configuration
        $pusher = new Pusher(
            env('PUSHER_APP_KEY'),
            env('PUSHER_APP_SECRET'),
            env('PUSHER_APP_ID'),
            [
                'cluster' => env('PUSHER_APP_CLUSTER'),
                'useTLS' => true,
            ]
        );

        // Prepare data to send
        $data = [
            'message' => $request->message,
        ];

        // Trigger the event on the specified channel
        $pusher->trigger('notifications', 'TestNotification', $data);

        // Return a response indicating success
        return response()->json(['status' => 'Notification sent successfully']);
    }
}
