<?php

namespace App\Events;

use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class TestNotification implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $message;
    public $user_id;

    public function __construct($user_id, $message)
    {
        $this->user_id = $user_id;
        $this->message = $message;
    }

public function broadcastOn()
{
    return new PrivateChannel('user.' . $this->user_id);
}


    public function broadcastWith()
    {
        return ['message' => $this->message];
    }
}
