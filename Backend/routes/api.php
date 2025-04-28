<?php

use App\Http\Controllers\Auth\ForgotPasswordController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

use App\Http\Controllers\Auth\UserController;
use App\Http\Controllers\Company\CompanyController;
use App\Http\Controllers\CompanyUserLoginController;
use App\Http\Controllers\CompanyVerificationController;
use App\Http\Controllers\JobApplicationController;
use App\Http\Controllers\JobController;
use App\Http\Controllers\UserDetailController;

//Open routes i vendos ketu
Route::post('register/user', [UserController::class, 'register']);
Route::post('login', [UserController::class, 'login']);
Route::post('register/company', [CompanyController::class, 'register']);
Route::post('company-user/login', [CompanyUserLoginController::class, 'login']);
Route::get('/public/jobs', [JobController::class, 'publicIndex']);
Route::get('/public/jobs/{id}', [JobController::class, 'publicShow']);
Route::post('/forgot-password', [ForgotPasswordController::class, 'sendCode']);
Route::post('/verify-code', [ForgotPasswordController::class, 'verifyCode']);
Route::post('/reset-password', [ForgotPasswordController::class, 'resetPassword']);

//Protected routes i vendos ketu
Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('user/details', [UserController::class, 'updateUserDetails']);
    Route::post('logout', [UserController::class, 'logout']);
    Route::get('users', [UserController::class, 'getAllUsers'])->middleware('permission:READ_USERS');
    Route::put('users/me', [UserController::class, 'updateMyUserData']);
    Route::put('users/{id}', [UserController::class, 'updateUser'])->middleware('permission:EDIT_USERS');
    Route::delete('users/{id}', [UserController::class, 'softDeleteUser'])->middleware('permission:DELETE_USERS');
    Route::get('/company-verification/{companyId}', [CompanyVerificationController::class, 'getCompanyVerification']);
    Route::post('/company-verification/{companyId}/activate', [CompanyVerificationController::class, 'activateVerification'])->middleware('permission:APPROVE_APPLICATION');
    Route::post('/company-verification/{companyId}/refuse', [CompanyVerificationController::class, 'refuseVerification']);
    Route::get('/companies', [CompanyVerificationController::class, 'getCompanies']);
    Route::post('/apply-for-verification', [CompanyVerificationController::class, 'applyForVerification']);
    Route::get('/get-my-permissions', [UserController::class, 'getMyPermissions']);
    Route::post('/user/profile-image-update', [UserDetailController::class, 'updateProfileImage']);
    Route::get('/users/{id}/details', [UserController::class, 'getUserWithDetailsById'])->middleware('permission:READ_USERS');
    Route::post('/jobs', [JobController::class, 'store']);
    Route::get('/jobs', [JobController::class, 'index']);
    Route::post('/job-apply', [JobApplicationController::class, 'apply']);
    Route::get('/job-applications/{jobId}', [JobApplicationController::class, 'getApplicationsForJob']);
});
Route::middleware('auth:sanctum')->get('/my-applications', [JobApplicationController::class, 'getUserApplications']);
Route::middleware('auth:sanctum')->post('/company/logo', [CompanyController::class, 'uploadLogo']);
Route::middleware('auth:sanctum')->get('/me', [UserController::class, 'getMyDetails']);



