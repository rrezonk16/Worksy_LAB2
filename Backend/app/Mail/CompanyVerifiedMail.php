<?php
namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class CompanyVerifiedMail extends Mailable
{
    use Queueable, SerializesModels;

    public $company;

    public function __construct($company)
    {
        $this->company = $company;
    }

    public function build()
    {
        return $this->subject('Your Company Has Been Verified!')
                    ->view('emails.company_verified');
    }
}
