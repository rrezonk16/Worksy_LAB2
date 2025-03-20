<?php

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

//Open routes i vendos ketu
Route::post('register/user', [UserController::class, 'register']);
Route::post('login', [UserController::class, 'login']);

//Protected routes i vendos ketu
Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('user/details', [UserController::class, 'updateUserDetails']);
    Route::post('logout', [UserController::class, 'logout']);
    Route::get('users', [UserController::class, 'getAllUsers'])->middleware('permission:READ_USERS');
    Route::put('users/me', [UserController::class, 'updateMyUserData']);
    Route::put('users/{id}', [UserController::class, 'updateUser'])->middleware('permission:EDIT_USERS');
    Route::delete('users/{id}', [UserController::class, 'softDeleteUser'])->middleware('permission:DELETE_USERS');
});
