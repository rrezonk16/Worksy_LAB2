<?php

namespace App\Http\Controllers;

use App\Models\JobApplication;
use App\Models\JobApplicationAnswer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Models\Job;
use App\Mail\JobApplicationConfirmationMail;
use App\Mail\JobApplicationSubmitted;
use App\Models\JobQuestion;

class JobApplicationController extends Controller
{

    public function getUserApplications()
    {
        $user = auth()->user();
    
        // Retrieve applications, including job, answers with questions, and the company associated with the job
        $applications = $user->jobApplications()
            ->with(['job.company', 'answers.question']) // Eager load job with company and answers with questions
            ->get()
            ->map(function ($application) {
                return [
                    'job' => [
                        'id' => $application->job->id,
                        'title' => $application->job->title,
                        'description' => $application->job->description,
                        'company' => [
                            'name' => $application->job->company->name, // Company details
                            'logo' => $application->job->company->logo, // Company logo or any other company details
                        ]
                    ],
                    'answers' => $application->answers->map(function ($answer) {
                        return [
                            'id' => $answer->id,
                            'job_application_id' => $answer->job_application_id,
                            'job_question_id' => $answer->job_question_id,
                            'answer' => $answer->answer,
                            'created_at' => $answer->created_at,
                            'updated_at' => $answer->updated_at,
                            'question_text' => $answer->question ? $answer->question->question_text : null, // Ensure we fetch the question text
                        ];
                    }),
                ];
            });
    
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
        $job = Job::with('company')->findOrFail($request->job_id);

        $application = JobApplication::create([
            'job_id' => $request->job_id,
            'user_id' => $user->id,
        ]);

        $answerData = [];

        foreach ($request->answers as $ans) {
            $question = JobQuestion::find($ans['question_id']);

            JobApplicationAnswer::create([
                'job_application_id' => $application->id,
                'job_question_id' => $ans['question_id'],
                'answer' => $ans['answer'],
            ]);

            $answerData[] = [
                'question' => $question->question_text,
                'answer' => $ans['answer'],
            ];
        }

        Mail::to($user->email)->send(new JobApplicationConfirmationMail($user, $job));

        $companyEmail = $job->company->email ?? null;
        if ($companyEmail) {
            Mail::to($companyEmail)->send(new JobApplicationSubmitted($job, $user, $answerData));
        }

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
