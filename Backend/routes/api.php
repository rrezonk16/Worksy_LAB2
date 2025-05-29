<?php



use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;

// Controllers
use App\Http\Controllers\Auth\UserController;
use App\Http\Controllers\Auth\ForgotPasswordController;
use App\Http\Controllers\Company\CompanyController;
use App\Http\Controllers\CompanyUserLoginController;
use App\Http\Controllers\CompanyVerificationController;
use App\Http\Controllers\JobController;
use App\Http\Controllers\JobApplicationController;
use App\Http\Controllers\SubscriptionController;
use App\Http\Controllers\UserDetailController;
use App\Http\Controllers\PastJobController;
use App\Http\Controllers\RolePermissionController;
use App\Http\Controllers\ApiLogController;
use App\Http\Controllers\InterviewMeetingController;
use App\Http\Controllers\JobApplicationStatusController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\LocationController;

/*
|--------------------------------------------------------------------------
| PUBLIC ROUTES
|--------------------------------------------------------------------------
| These routes do not require authentication
*/



Route::get('/countries', [LocationController::class, 'getCountries']);
Route::get('/countries/{id}/cities', [LocationController::class, 'getCitiesByCountry']);

// Auth
Route::post('register/user', [UserController::class, 'register']);
Route::post('login', [UserController::class, 'login']);
Route::post('register/company', [CompanyController::class, 'register']);
Route::post('company-user/login', [CompanyUserLoginController::class, 'login']);

// Public Jobs
Route::get('/public/jobs', [JobController::class, 'publicIndex']);
Route::get('/premium/jobs', [JobController::class, 'premiumPublicJobs']);
Route::get('/public/jobs/{id}', [JobController::class, 'publicShow']);

// Password Reset
Route::post('/forgot-password', [ForgotPasswordController::class, 'sendCode']);
Route::post('/verify-code', [ForgotPasswordController::class, 'verifyCode']);
Route::post('/reset-password', [ForgotPasswordController::class, 'resetPassword']);
Route::get('/users/{id}', [UserController::class, 'getUserById']);

// Job Details
Route::get('/api/jobs/{id}', [JobController::class, 'show']);

// Past Jobs (Public access by user ID)
Route::get('user/{userId}/past-jobs', [PastJobController::class, 'getByUserId']);

Route::post('/send-notification', [NotificationController::class, 'sendNotification']);
/*
|--------------------------------------------------------------------------
| PROTECTED ROUTES (AUTHENTICATED via Sanctum)
|--------------------------------------------------------------------------
*/


Route::middleware(['auth:sanctum'])->group(function () {

    // Auth & Profile
    Route::post('user/details', [UserController::class, 'updateUserDetails']);
    Route::put('users/me', [UserController::class, 'updateMyUserData']);
    Route::post('logout', [UserController::class, 'logout']);
    Route::get('/me', [UserController::class, 'getMyDetails']);
    Route::post('/user/update-profile', [UserDetailController::class, 'updateProfileAndDetails']);
    Route::post('/user/profile-image-update', [UserDetailController::class, 'updateProfileImage']);
    Route::get('/get-my-permissions', [UserController::class, 'getMyPermissions']);
    Route::post('/user/change-password', [UserController::class, 'changePassword']);
    Route::post('/upload-resume', [UserController::class, 'uploadCV']);
    // User Management (with permissions)
    Route::get('users', [UserController::class, 'getAllUsers'])->middleware('permission:READ_USERS');
    Route::put('users/{id}', [UserController::class, 'updateUser'])->middleware('permission:READ_USERS');
    Route::delete('users/{id}', [UserController::class, 'softDeleteUser'])->middleware('permission:READ_USERS');
    Route::get('/users/{id}/details', [UserController::class, 'getUserWithDetailsById'])->middleware('permission:READ_USERS');

    // Company Management
    Route::prefix('companies')->group(function () {
        Route::get('/', [CompanyController::class, 'index']);
        Route::get('/{id}', [CompanyController::class, 'show']);
        Route::put('/{id}', [CompanyController::class, 'update']);
        Route::delete('/{id}', [CompanyController::class, 'destroy']);
    });
    Route::post('/company/logo', [CompanyController::class, 'uploadLogo']);

    // Company Verification
    Route::get('/company-verification/{companyId}', [CompanyVerificationController::class, 'getCompanyVerification']);
    Route::post('/company-verification/{companyId}/activate', [CompanyVerificationController::class, 'activateVerification'])->middleware('permission:APPROVE_APPLICATION');
    Route::post('/company-verification/{companyId}/refuse', [CompanyVerificationController::class, 'refuseVerification']);
    Route::post('/apply-for-verification', [CompanyVerificationController::class, 'applyForVerification']);
    Route::post('/company-users', [CompanyUserLoginController::class, 'createUser']);
    Route::get('/company-users', [CompanyUserLoginController::class, 'getAllUsers']);
    Route::put('/company-users/{id}', [CompanyUserLoginController::class, 'updateUser']);
    Route::delete('/company-users/{id}', [CompanyUserLoginController::class, 'deleteUser']);
    Route::put('/company-users/{id}/password', [CompanyUserLoginController::class, 'changePassword']);
    // Job Management
    Route::post('/jobs', [JobController::class, 'store']);
    Route::get('/jobs', [JobController::class, 'index']);
    Route::get('/jobs/{id}', [JobController::class, 'show']);
    Route::put('/jobs/{id}/update', [JobController::class, 'update']);
    Route::delete('/jobs/{id}', [JobController::class, 'destroy']);
    Route::delete('/admin/jobs/{id}', [JobController::class, 'forceDelete']);
    Route::get('/admin/jobs/all', [JobController::class, 'getAllJobsRaw']);

    // Job Applications
    Route::post('/job-apply', [JobApplicationController::class, 'apply']);
    Route::get('/job-applications/{jobId}', [JobApplicationController::class, 'getApplicationsForJob']);
    Route::get('/my-applications', [JobApplicationController::class, 'getUserApplications']);
    Route::get('/applications/{id}', [JobApplicationController::class, 'getApplicationById']);
    Route::put('/job-apply/{applicationId}', [JobApplicationController::class, 'updateApplication']);
    Route::post('/schedule-interview', [JobApplicationStatusController::class, 'schedule']);
    Route::put('/job-applications/{id}/status', [JobApplicationStatusController::class, 'updateStatus']);
    Route::post('/interview-meetings', [InterviewMeetingController::class, 'store']);
    Route::get('/interview-meetings/{application_id}', [InterviewMeetingController::class, 'getByApplicationId']);

    // Subscription
    Route::get('/subscription', [SubscriptionController::class, 'getSubscriptionByCompanyUser']);
    Route::post('/subscribe-premium', [SubscriptionController::class, 'store']);

    // Roles & Permissions
    Route::post('/roles', [RolePermissionController::class, 'createRole']);
    Route::post('/roles/{roleId}/permissions', [RolePermissionController::class, 'assignPermissionsToRole']);
    Route::get('/roles/{roleId}/permissions', [RolePermissionController::class, 'getPermissionsForRole']);
    Route::post('/users/{userId}/role', [RolePermissionController::class, 'assignRoleToUser']);
    Route::get('/users/{userId}/role', [RolePermissionController::class, 'getUserRole']);
    Route::get('/roles', [RolePermissionController::class, 'getRoles']);
    Route::get('/permissions', [RolePermissionController::class, 'getPermissions']);
    Route::get('/permissions/my-permissions', [RolePermissionController::class, 'getMyPermissions']);

    // Logs
    Route::get('/download-logs', [ApiLogController::class, 'downloadLogs']);

    // Past Jobs
    Route::get('past-jobs', [PastJobController::class, 'index']);
    Route::post('past-jobs', [PastJobController::class, 'store']);
    Route::get('past-jobs/{id}', [PastJobController::class, 'show']);
    Route::put('past-jobs/{id}', [PastJobController::class, 'update']);
    Route::delete('past-jobs/{id}', [PastJobController::class, 'destroy']);
});
