<?php

use App\Http\Controllers\JobController;
use Illuminate\Support\Facades\Route;

Route::get('/share/job/{id}', [JobController::class, 'shareJob']);
