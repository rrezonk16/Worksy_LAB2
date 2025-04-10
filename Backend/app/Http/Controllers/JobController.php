<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Models\Job;
use App\Models\JobQuestion;
use App\Models\JobQuestionOption;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
   use Illuminate\Support\Facades\DB;
    use Illuminate\Support\Facades\Log;

class JobController extends Controller
{
 
    
public function index(Request $request)
{
    $companyUser = auth()->user();

    if (!$companyUser || !$companyUser->company_id) {
        return response()->json(['message' => 'Unauthorized or invalid company user.'], 403);
    }

    $jobs = Job::with([
        'questions.options',
        'company'
    ])
    ->where('company_id', $companyUser->company_id)
    ->latest()
    ->get();

    return response()->json([
        'jobs' => $jobs
    ]);
}
    public function store(Request $request)
    {
        $companyUser = auth()->user();
    
        if (!$companyUser || !$companyUser->company_id) {
            return response()->json(['message' => 'Unauthorized or invalid company user.'], 403);
        }
    
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'questions' => 'nullable|string', // received as JSON string
            'attachment' => 'nullable|file|max:20480',
        ]);
    
        try {
            DB::beginTransaction();
    
            $questions = [];
            if (!empty($validated['questions'])) {
                $questions = json_decode($validated['questions'], true);
    
                if (!is_array($questions)) {
                    return response()->json(['message' => 'Invalid questions format. Must be a valid JSON array.'], 422);
                }
            }
    
            $filePath = null;
            if ($request->hasFile('attachment')) {
                $file = $request->file('attachment');
                $filename = \Str::uuid() . '.' . $file->getClientOriginalExtension();
                $filePath = $file->storeAs('job_attachments', $filename, 'public');
            }
    
            $job = Job::create([
                'title' => $validated['title'],
                'description' => $validated['description'] ?? null,
                'company_id' => $companyUser->company_id,
            ]);
    
            foreach ($questions as $q) {
                if (
                    empty($q['question_text']) ||
                    empty($q['input_type']) ||
                    !isset($q['is_required'])
                ) {
                    DB::rollBack();
                    return response()->json(['message' => 'Each question must include question_text, input_type, and is_required.'], 422);
                }
    
                $question = JobQuestion::create([
                    'job_id' => $job->id,
                    'question_text' => $q['question_text'],
                    'input_type' => $q['input_type'],
                    'is_required' => $q['is_required'],
                ]);
    
                if ($q['input_type'] === 'select' && !empty($q['options']) && is_array($q['options'])) {
                    foreach ($q['options'] as $optionText) {
                        JobQuestionOption::create([
                            'job_question_id' => $question->id,
                            'option_text' => $optionText,
                        ]);
                    }
                }
            }
    
            DB::commit();
    
            return response()->json([
                'message' => 'Job created successfully.',
                'job_id' => $job->id,
                'attachment_url' => $filePath ? asset('storage/' . $filePath) : null,
            ], 201);
    
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Job creation failed: ' . $e->getMessage());
            return response()->json([
                'message' => 'An error occurred while creating the job.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    }
