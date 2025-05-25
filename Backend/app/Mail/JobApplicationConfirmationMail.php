<?php
namespace App\Mail;

use App\Models\Job;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class JobApplicationConfirmationMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public $job;
    public $user;

    public function __construct($user, Job $job)
    {
        $this->user = $user;
        $this->job = $job;
    }

    public function build()
    {
        return $this->subject('Job Application Confirmation')
                    ->view('emails.application-confirmation');
    }
}
