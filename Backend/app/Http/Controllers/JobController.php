<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Job;
use App\Models\JobDetail;
use App\Models\JobQuestion;
use App\Models\JobQuestionOption;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;
use App\Events\TestNotification;
use App\Models\Country;
use Carbon\Carbon;
use Illuminate\Support\Facades\Request as FacadeRequest; // Add this at the top

class JobController extends Controller
{
    public function getJobsByCountry($country)
    {
        $countryModel = Country::where('name', $country)->firstOrFail();

        $queryParams = FacadeRequest::query();

        $request = new Request(array_merge($queryParams, [
            'country_id' => $countryModel->id,
            'per_page' => 6,
        ]));

        return $this->publicIndex($request);
    }


    public function destroy($id)
    {
        $user = auth()->user();
        $job = Job::find($id);

        if (!$job) {
            return response()->json(['message' => 'Job not found'], 404);
        }

        if ($job->company_id !== $user->company_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        Cache::tags(['public_jobs'])->flush();

        $job->delete();

        return response()->json(['message' => 'Job deleted successfully']);
    }
    public function forceDelete($id)
    {
        $job = Job::find($id);

        if (!$job) {
            return response()->json(['message' => 'Job not found'], 404);
        }

        $job->delete();
        Cache::tags(['public_jobs'])->flush();

        return response()->json(['message' => 'Job deleted without ownership check']);
    }


    public function getAllJobsRaw()
    {
        $jobs = Job::with(['details', 'company', 'questions.options'])->get();

        return response()->json($jobs);
    }




    public function publicIndex(Request $request)
    {
        $cacheKey = md5(json_encode($request->all()));
        $cacheTime = 600;

        $jobs = Cache::tags(['public_jobs'])->remember($cacheKey, $cacheTime, function () use ($request) {
            $query = Job::with([
                'questions.options',
                'company.subscriptions' => function ($q) {
                    $q->orderByDesc('end_date')->limit(1);
                },
                'details'
            ]);

            $query->whereHas('details', function ($q) {
                $q->where('deadline', '>=', Carbon::today());
            });

            if ($request->filled('search')) {
                $search = $request->search;

                $query->where(function ($q) use ($search) {
                    $q->where('title', 'like', "%{$search}%")
                        ->orWhereHas('details', function ($q2) use ($search) {
                            $q2->where('location', 'like', "%{$search}%")
                                ->orWhere('employment_type', 'like', "%{$search}%")
                                ->orWhere('experience_level', 'like', "%{$search}%")
                                ->orWhereJsonContains('benefits', $search)
                                ->orWhereJsonContains('hashtags', $search);
                        });
                });
            }

            if ($request->filled('name')) {
                $query->where('title', 'like', '%' . $request->name . '%');
            }

            if ($request->filled('tag')) {
                $query->whereHas('details', function ($q) use ($request) {
                    $q->where('tag', 'like', '%' . $request->tag . '%');
                });
            }

            if ($request->filled('country_id')) {
                $query->whereHas('details', function ($q) use ($request) {
                    $q->where('country_id', $request->country_id);
                });
            }

            if ($request->filled('city')) {
                $query->whereHas('details', function ($q) use ($request) {
                    $q->where('location', 'like', '%' . $request->city . '%');
                });
            }

            if ($request->filled('max_wage')) {
                $query->whereHas('details', function ($q) use ($request) {
                    $q->where('wage', '<=', $request->max_wage);
                });
            }

            if ($request->filled('min_wage')) {
                $query->whereHas('details', function ($q) use ($request) {
                    $q->where('wage', '>=', $request->min_wage);
                });
            }

            if ($request->filled('employment_type')) {
                $query->whereHas('details', function ($q) use ($request) {
                    $q->where('employment_type', 'like', '%' . $request->employment_type . '%');
                });
            }

            if ($request->filled('experience_level')) {
                $query->whereHas('details', function ($q) use ($request) {
                    $q->where('experience_level', 'like', '%' . $request->experience_level . '%');
                });
            }

            if ($request->filled('benefits')) {
                $query->whereHas('details', function ($q) use ($request) {
                    $q->whereJsonContains('benefits', $request->benefits);
                });
            }

            if ($request->filled('hashtags')) {
                $query->whereHas('details', function ($q) use ($request) {
                    $q->whereJsonContains('hashtags', $request->hashtags);
                });
            }

            if ($request->filled('company_id')) {
                $query->where('company_id', $request->company_id);
            }

            if ($request->filled('deadline')) {
                $query->whereHas('details', function ($q) use ($request) {
                    $q->where('deadline', '>=', $request->deadline);
                });
            }

            $sortBy = $request->get('sort_by', 'created_at');
            $sortOrder = $request->get('sort_order', 'desc');
            $query->orderBy($sortBy, $sortOrder);

            $perPage = $request->get('per_page', 12);
            return $query->paginate($perPage);
        });

        return response()->json($jobs);
    }



    public function publicShow($id)
    {
        $job = Job::with([
            'questions.options',
            'company',
            'details.country',
            'details.city',
        ])->findOrFail($id);

        return response()->json([
            'job' => $job
        ]);
    }

    public function premiumPublicJobs()
    {
        $jobs = Job::with([
            'questions.options',
            'company',
            'details'
        ])
            ->inRandomOrder()
            ->take(3)
            ->get();

        return response()->json([
            'data' => $jobs
        ]);
    }


    public function index(Request $request)
    {

        $companyUser = auth()->user();

        if (!$companyUser || !$companyUser->company_id) {
            return response()->json(['message' => 'Unauthorized or invalid company user.'], 403);
        }

        $jobs = Job::with([
            'questions.options',
            'company',
            'details'
        ])
            ->where('company_id', $companyUser->company_id)
            ->latest()
            ->get();

        return response()->json([
            'jobs' => $jobs
        ]);
    }


    // public function sendNotification(Request $request)
    // {
    //     $user_id = $request->user_id; // User who should receive the notification
    //     $message = "New notification for user {$user_id}";

    //     event(new TestNotification($user_id, $message));

    //     return response()->json(['message' => 'Notification sent!']);
    // }

    public function store(Request $request)
    {
        $companyUser = auth()->user();

        if (!$companyUser || !$companyUser->company_id) {
            return response()->json(['message' => 'Unauthorized or invalid company user.'], 403);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'questions' => 'nullable|string',
            'attachment' => 'nullable|file|max:20480',

            // Job detail fields
            'wage' => 'nullable|string',
            'location' => 'nullable|string',
            'employment_type' => 'nullable|string',
            'experience_level' => 'nullable|string',
            'hashtags' => 'nullable|array',
            'hashtags.*' => 'string',
            'benefits' => 'nullable|array',
            'benefits.*' => 'string',
            'deadline' => 'nullable|date',
            'city_id' => 'nullable|exists:cities,id',
            'country_id' => 'nullable|exists:countries,id',
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

            JobDetail::create([
                'job_id' => $job->id,
                'wage' => $validated['wage'] ?? null,
                'location' => $validated['location'] ?? null,
                'employment_type' => $validated['employment_type'] ?? null,
                'experience_level' => $validated['experience_level'] ?? null,
                'hashtags' => $validated['hashtags'] ?? [],
                'benefits' => $validated['benefits'] ?? [],
                'deadline' => $validated['deadline'] ?? null,
                'country_id' => $validated['country_id'] ?? null,
                'city_id' => $validated['city_id'] ?? null,
            ]);

            $allowedInputTypes = ['text', 'yesno', 'file', 'select'];

            foreach ($questions as $q) {
                if (
                    empty($q['question_text']) ||
                    empty($q['input_type']) ||
                    !isset($q['is_required'])
                ) {
                    DB::rollBack();
                    return response()->json(['message' => 'Each question must include question_text, input_type, and is_required.'], 422);
                }

                if (!in_array($q['input_type'], $allowedInputTypes)) {
                    DB::rollBack();
                    return response()->json(['message' => 'Invalid input type: ' . $q['input_type']], 422);
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
            Cache::tags(['public_jobs'])->flush();

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
    public function show($id)
    {
        $job = Job::with([
            'details',
            'questions.options'
        ])->find($id);

        if (!$job) {
            return response()->json(['message' => 'Job not found.'], 404);
        }

        return response()->json(['job' => $job]);
    }

    public function shareJob($id)
    {
        $job = Job::with('company', 'details', 'questions')->findOrFail($id);

        // Pass job data to the view
        return view('share.job', compact('job'));
    }

    public function update(Request $request, $id)
    {
        $companyUser = auth()->user();

        if (!$companyUser || !$companyUser->company_id) {
            return response()->json(['message' => 'Unauthorized or invalid company user.'], 403);
        }

        $job = Job::with('details', 'questions')->find($id);

        if (!$job || $job->company_id !== $companyUser->company_id) {
            return response()->json(['message' => 'Job not found or unauthorized.'], 404);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'questions' => 'nullable|string',
            'attachment' => 'nullable|file|max:20480',

            'wage' => 'nullable|string',
            'location' => 'nullable|string',
            'employment_type' => 'nullable|string',
            'experience_level' => 'nullable|string',
            'hashtags' => 'nullable|array',
            'hashtags.*' => 'string',
            'benefits' => 'nullable|array',
            'benefits.*' => 'string',
            'deadline' => 'nullable|date',
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

            $filePath = $job->attachment;
            if ($request->hasFile('attachment')) {
                $file = $request->file('attachment');
                $filename = \Str::uuid() . '.' . $file->getClientOriginalExtension();
                $filePath = $file->storeAs('job_attachments', $filename, 'public');
            }

            $job->update([
                'title' => $validated['title'],
                'description' => $validated['description'] ?? null,
                'attachment' => $filePath,
            ]);

            $job->details->update([
                'wage' => $validated['wage'] ?? null,
                'location' => $validated['location'] ?? null,
                'employment_type' => $validated['employment_type'] ?? null,
                'experience_level' => $validated['experience_level'] ?? null,
                'hashtags' => $validated['hashtags'] ?? [],
                'benefits' => $validated['benefits'] ?? [],
                'deadline' => $validated['deadline'] ?? null,
            ]);

            foreach ($job->questions as $question) {
                $question->options()->delete();
                $question->delete();
            }

            $allowedInputTypes = ['text', 'yesno', 'file', 'select'];

            foreach ($questions as $q) {
                if (
                    empty($q['question_text']) ||
                    empty($q['input_type']) ||
                    !isset($q['is_required'])
                ) {
                    DB::rollBack();
                    return response()->json(['message' => 'Each question must include question_text, input_type, and is_required.'], 422);
                }

                if (!in_array($q['input_type'], $allowedInputTypes)) {
                    DB::rollBack();
                    return response()->json(['message' => 'Invalid input type: ' . $q['input_type']], 422);
                }

                $newQuestion = JobQuestion::create([
                    'job_id' => $job->id,
                    'question_text' => $q['question_text'],
                    'input_type' => $q['input_type'],
                    'is_required' => $q['is_required'],
                ]);

                if ($q['input_type'] === 'select' && !empty($q['options']) && is_array($q['options'])) {
                    foreach ($q['options'] as $optionText) {
                        JobQuestionOption::create([
                            'job_question_id' => $newQuestion->id,
                            'option_text' => $optionText,
                        ]);
                    }
                }
            }

            DB::commit();
            Cache::tags(['public_jobs'])->flush();

            return response()->json([
                'message' => 'Job updated successfully.',
                'attachment_url' => $filePath ? asset('storage/' . $filePath) : null,
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Job update failed: ' . $e->getMessage());
            return response()->json([
                'message' => 'An error occurred while updating the job.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
