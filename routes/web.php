<?php

use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\SkillController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Comapny\CompanyController;
use App\Http\Controllers\employer\ProfileController;
use App\Http\Controllers\EmployerController;
use App\Http\Controllers\JobPostingController;
use App\Http\Controllers\LocationController;
use App\Http\Controllers\NotificationController;
use Illuminate\Support\Facades\Route;

Route::redirect('/', '/login');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::middleware(['ensure.employer.company.exists'])->group(function () {
        Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
        Route::resource('/users', UserController::class);
        Route::resource('/skills', SkillController::class);
        Route::resource('/job-postings', JobPostingController::class);
        Route::get('/employer/register/company', [CompanyController::class, 'create'])->name('company.register');
        Route::post('/employer/register/company', [CompanyController::class, 'store'])->name('company.register');
        Route::resource('/employers', EmployerController::class);
    });
    Route::get('/notifications/{notificationId}/markAsRead', [NotificationController::class, 'markAsRead'])->name('notifications.markAsRead');
});

Route::get('/location/countries', [LocationController::class, 'getCountries'])->name('getCountries');
Route::post('/location/states', [LocationController::class, 'getStates'])->name('getStates');
Route::post('/location/cities', [LocationController::class, 'getCities'])->name('getCities');
Route::post('/employer/profile/image-upload', [ProfileController::class, 'uploadImage'])->name('employer.profile.image.upload');
Route::post('/employer/profile/image-remove', [ProfileController::class, 'removeImage'])->name('employer.profile.image.remove');

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
