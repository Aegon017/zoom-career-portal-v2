<?php

use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\SkillController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Comapny\CompanyController;
use App\Http\Controllers\EmployerController;
use App\Http\Controllers\NotificationController;
use Illuminate\Support\Facades\Route;

Route::redirect('/', '/login');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::middleware(['ensure.employer.company.exists'])->group(function () {
        Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
        Route::resource('/users', UserController::class);
        Route::resource('/skills', SkillController::class);
        Route::get('/employer/register/company', [CompanyController::class, 'create'])->name('company.register');
        Route::post('/employer/register/company', [CompanyController::class, 'store'])->name('company.register');
        Route::resource('/employers', EmployerController::class);
    });
    Route::get('/notifications/{notificationId}/markAsRead', [NotificationController::class, 'markAsRead'])->name('notifications.markAsRead');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
