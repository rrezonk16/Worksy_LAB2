<?php
namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class JobApplicationSubmitted extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public $job;
    public $user;
    public $answers;

    public function __construct($job, $user, $answers)
    {
        $this->job = $job;
        $this->user = $user;
        $this->answers = $answers;
    }

    public function build()
    {
        return $this->subject('New Application for: ' . $this->job->title)
                    ->view('emails.job_application_submitted');
    }
}
