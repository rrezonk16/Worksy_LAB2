<?php

namespace App\Mail;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class WelcomePremiumSubscriber extends Mailable implements ShouldQueue
{
    use SerializesModels;

    public $companyName;
    public $startDate;
    public $subscriptionType;

    // Constructor to accept data
    public function __construct($companyName, $startDate, $subscriptionType)
    {
        $this->companyName = $companyName;
        $this->startDate = $startDate;
        $this->subscriptionType = $subscriptionType;
    }

    public function build()
    {
        return $this->subject('Welcome to Premium Subscription')
                    ->view('emails.welcome-premium'); // Reference the view to render the email
    }
}
