<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Carbon\Carbon;

class InterviewMeetingInvitation extends Mailable
{
    use Queueable, SerializesModels;

    public $meeting;
    public $job;
    public $company;

    public function __construct($meeting)
    {
        $this->meeting = $meeting;

        $jobApplication = $meeting->jobApplication ?? null;

        if ($jobApplication) {
            $this->job = $jobApplication->job;
            $this->company = $this->job->company ?? null;
        }
    }

    public function build()
    {
        $icsContent = $this->generateICS();

        return $this->subject('Interview Invitation')
            ->view('emails.interview-invitation')
            ->with([
                'job' => $this->job,
                'company' => $this->company,
                'meeting' => $this->meeting,
            ])
            ->attachData($icsContent, 'interview.ics', [
                'mime' => 'text/calendar',
            ]);
    }

    private function generateICS()
    {
        $start = Carbon::parse($this->meeting->scheduled_at);
        $end = $start->copy()->addMinutes(30);
        $uuid = $this->meeting->room_name ?? uniqid();

        $startFormatted = $start->format('Ymd\THis\Z');
        $endFormatted = $end->format('Ymd\THis\Z');
        $now = Carbon::now()->format('Ymd\THis\Z');

        $summary = "Interview for " . ($this->job->title ?? 'Job Position');
        $description = "You have been invited to a job interview with " . ($this->company->name ?? 'our company') . ". Please join via your account.";

        return <<<ICS
BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//YourApp//Interview Scheduler//EN
BEGIN:VEVENT
UID:$uuid
DTSTAMP:$now
DTSTART:$startFormatted
DTEND:$endFormatted
SUMMARY:$summary
DESCRIPTION:$description
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR
ICS;
    }
}
