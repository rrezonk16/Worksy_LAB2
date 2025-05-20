<?php

namespace App\Http\Controllers;

use App\Mail\InterviewScheduledMail;
use App\Models\JobApplication;
use App\Models\JobApplicationAnswer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Models\Job;
use App\Mail\JobApplicationConfirmationMail;
use App\Mail\JobApplicationSubmitted;
use App\Models\Interview;
use App\Models\JobQuestion;

class JobApplicationController extends Controller
{

  

    public function getUserApplications()
    {
        $user = auth()->user();

        $applications = $user->jobApplications()
            ->with(['job.company', 'answers.question'])
            ->get()
            ->map(function ($application) {
                return [
                    'application_id' => $application->id,
                    'status' => $application->status,

                    'job' => [
                        'id' => $application->job->id,
                        'title' => $application->job->title,
                        'description' => $application->job->description,
                        'company' => [
                            'name' => $application->job->company->name,
                            'logo' => $application->job->company->logo,
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
                            'question_text' => $answer->question ? $answer->question->question_text : null,
                        ];
                    }),
                ];
            });

        return response()->json([
            'jobs' => $applications,
        ]);
    }

    public function getApplicationById($applicationId)
    {
        $user = auth()->user();

        $application = JobApplication::with([
            'job.company',
            'job.details',
            'job.questions.options',
            'user',
            'answers.question'
        ])
            ->where('id', $applicationId)
            ->where('user_id', $user->id)
            ->first();

        if (!$application) {
            return response()->json(['message' => 'Application not found.'], 404);
        }

        return response()->json([
            'application' => [
                'application_id' => $application->id,
                'status' => $application->status,

                'job' => [
                    ...$application->job->toArray(), // includes title, description, etc.
                    'company' => $application->job->company->toArray(),
                    'details' => $application->job->details ? $application->job->details->toArray() : null,
                    'questions' => $application->job->questions->map(function ($q) {
                        return [
                            'id' => $q->id,
                            'question_text' => $q->question_text,
                            'input_type' => $q->input_type,
                            'is_required' => $q->is_required,
                            'options' => $q->options->map(function ($o) {
                                return [
                                    'id' => $o->id,
                                    'option_text' => $o->option_text
                                ];
                            })
                        ];
                    }),
                ],
                'user' => [
                    'id' => $application->user->id,
                    'name' => $application->user->name,
                    'email' => $application->user->email,

                ],
                'answers' => $application->answers->map(function ($answer) {
                    return [
                        'id' => $answer->id,

                        'job_question_id' => $answer->job_question_id,
                        'question_text' => $answer->question ? $answer->question->question_text : null,
                        'answer' => $answer->answer,
                    ];
                }),
            ]
        ]);
    }
    public function getAllApplicationsByJobId($jobId)
    {
        $applications = JobApplication::with([
            'user',
            'answers.question',
            'job.company'
        ])
            ->where('job_id', $jobId)
            ->get()
            ->map(function ($application) {
                return [
                    'application_id' => $application->id,
                    'status' => $application->status,
                    'user' => [
                        'id' => $application->user->id,
                        'name' => $application->user->name,
                        'email' => $application->user->email,
                    ],
                    'answers' => $application->answers->map(function ($answer) {
                        return [
                            'question_text' => $answer->question?->question_text,
                            'answer' => $answer->answer
                        ];
                    }),
                    'job' => [
                        'title' => $application->job->title,
                        'company' => $application->job->company->name
                    ]
                ];
            });

        return response()->json(['applications' => $applications]);
    }



    public function apply(Request $request)
    {
        $request->validate([
            'job_id' => 'required|exists:jobs,id',
            'answers' => 'required|array',
            'answers.*.question_id' => 'required|exists:job_questions,id',
            'answers.*.answer' => 'required' // Can be string or file depending on input_type
        ]);

        $user = auth()->user();
        $job = Job::with('company')->findOrFail($request->job_id);

        $alreadyApplied = JobApplication::where('job_id', $request->job_id)
            ->where('user_id', $user->id)
            ->exists();

        if ($alreadyApplied) {
            return response()->json([
                'message' => 'You have already applied to this job.'
            ], 409);
        }

        $application = JobApplication::create([
            'job_id' => $request->job_id,
            'user_id' => $user->id,
        ]);

        $answerData = [];

        foreach ($request->answers as $index => $ans) {
            $question = JobQuestion::find($ans['question_id']);
            $inputType = $question->input_type;

            $storedAnswer = '';

            if ($inputType === 'file') {
                $fileKey = "answers.$index.answer";

                if ($request->hasFile($fileKey)) {
                    $file = $request->file($fileKey);
                    $path = $file->store('applications/files', 'public');
                    $storedAnswer = $path;
                } else {
                    continue; // Skip if no file is provided
                }
            } else {
                $storedAnswer = $ans['answer'];
            }

            JobApplicationAnswer::create([
                'job_application_id' => $application->id,
                'job_question_id' => $ans['question_id'],
                'answer' => $storedAnswer,
            ]);

            $answerData[] = [
                'question' => $question->question_text,
                'answer' => $inputType === 'file' ? asset('storage/' . $storedAnswer) : $storedAnswer,
            ];
        }

        Mail::to($user->email)->queue(new JobApplicationConfirmationMail($user, $job));

        $companyEmail = $job->company->email ?? null;
        if ($companyEmail) {
            Mail::to($companyEmail)->queue(new JobApplicationSubmitted($job, $user, $answerData));
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


    public function updateApplication(Request $request, $applicationId)
    {
        $request->validate([
            'answers' => 'required|array',
            'answers.*.question_id' => 'required|exists:job_questions,id',
            'answers.*.answer' => 'required' // string or file
        ]);

        $user = auth()->user();

        $application = JobApplication::where('id', $applicationId)
            ->where('user_id', $user->id)
            ->first();

        if (!$application) {
            return response()->json(['message' => 'Application not found.'], 404);
        }

        JobApplicationAnswer::where('job_application_id', $application->id)->delete();

        $answerData = [];

        foreach ($request->answers as $index => $ans) {
            $question = JobQuestion::find($ans['question_id']);
            $inputType = $question->input_type;

            $storedAnswer = '';

            if ($inputType === 'file') {
                $fileKey = "answers.$index.answer";
                if ($request->hasFile($fileKey)) {
                    $file = $request->file($fileKey);
                    $path = $file->store('applications/files', 'public');
                    $storedAnswer = $path;
                } else {
                    continue;
                }
            } else {
                $storedAnswer = $ans['answer'];
            }

            JobApplicationAnswer::create([
                'job_application_id' => $application->id,
                'job_question_id' => $ans['question_id'],
                'answer' => $storedAnswer,
            ]);

            $answerData[] = [
                'question' => $question->question_text,
                'answer' => $inputType === 'file' ? asset('storage/' . $storedAnswer) : $storedAnswer,
            ];
        }

        return response()->json(['message' => 'Application updated successfully.']);
    }
}
