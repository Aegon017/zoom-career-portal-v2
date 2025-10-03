<?php

declare(strict_types=1);

use App\Http\Controllers\Api\CourseSearchController;
use App\Http\Controllers\Api\JobTitleSearchController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', fn (Request $request) => $request->user())->middleware('auth:sanctum');

Route::get('/job-titles/search', JobTitleSearchController::class);
Route::get('/courses/search', CourseSearchController::class);
