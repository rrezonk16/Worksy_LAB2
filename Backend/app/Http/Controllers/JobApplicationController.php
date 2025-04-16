<?php

namespace App\Http\Controllers;

use App\Models\JobApplication;
use App\Models\JobApplicationAnswer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\JobApplicationConfirmationMail;
use App\Models\Job;

class JobApplicationController extends Controller
{

    public function myApplications(Request $request)
    {
        $user = auth()->user();
    
        $applications = $user->jobApplications()
            ->with('job') // only include job, not answers
            ->get()
            ->map(function ($application) {
                return $application->job;
            })
            ->unique('id') // in case user applied multiple times to the same job
            ->values();
    
        return response()->json([
            'jobs' => $applications,
        ]);
    }
    

    public function apply(Request $request)
    {
        $request->validate([
            'job_id' => 'required|exists:jobs,id',
            'answers' => 'required|array',
            'answers.*.question_id' => 'required|exists:job_questions,id',
            'answers.*.answer' => 'required|string'
        ]);
    
        $user = auth()->user();
    
        $job = Job::findOrFail($request->job_id);

        $application = JobApplication::create([
            'job_id' => $request->job_id,
            'user_id' => $user->id,
        ]);
    
        foreach ($request->answers as $ans) {
            JobApplicationAnswer::create([
                'job_application_id' => $application->id,
                'job_question_id' => $ans['question_id'],
                'answer' => $ans['answer'],
            ]);
        }
        Mail::to($user->email)->send(new JobApplicationConfirmationMail($user, $job));

        return response()->json([
            'message' => 'Application submitted successfully.'
        ]);
    }

    public function getApplicationsForJob($jobId)
{
    $companyUser = auth()->user();

    $applications = JobApplication::with([
        'user',
        'answers.question',
        'job'
    ])
    ->whereHas('job', function ($q) use ($companyUser, $jobId) {
        $q->where('company_id', $companyUser->company_id)->where('id', $jobId);
    })
    ->get();

    return response()->json([
        'applications' => $applications
    ]);
}

    }
