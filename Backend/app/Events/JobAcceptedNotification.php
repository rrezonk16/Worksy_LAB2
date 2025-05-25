<?php

namespace App\Events;

use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class JobAcceptedNotification implements ShouldBroadcast
{
    use Dispatchable, SerializesModels;

    public $user_id;
    public $message;

    public function __construct($user_id, $job_name)
    {
        $this->user_id = $user_id;
        $this->message = "Your application for {$job_name} has been viewed.";
    }

    public function broadcastOn()
    {
        return new PrivateChannel('user.' . $this->user_id);
    }

    public function broadcastWith()
    {
        return ['message' => $this->message];
    }

    public function broadcastAs()
    {
        return 'job.accepted';
    }
}
