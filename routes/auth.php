<?php

declare(strict_types=1);

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\ConfirmablePasswordController;
use App\Http\Controllers\Auth\EmailVerificationNotificationController;
use App\Http\Controllers\Auth\EmailVerificationPromptController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\RegisteredEmployerController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\RemoteLoginController;
use App\Http\Controllers\Auth\VerifyEmailController;
use App\Http\Controllers\StudentRegisterController;
use Illuminate\Support\Facades\Route;

Route::middleware('guest')->group(function (): void {
    Route::prefix('employer')->name('employer.')->group(function (): void {
        Route::get('register', [RegisteredEmployerController::class, 'create'])->name('register');
        Route::post('register', [RegisteredEmployerController::class, 'store'])->name('register.store');
    });

    Route::get('student/register', [StudentRegisterController::class, 'create'])->name('student.register');
    Route::post('student/register', [StudentRegisterController::class, 'store'])->name('student.register.store');

    Route::get('register', [RegisteredUserController::class, 'create'])
        ->name('register');

    Route::post('register', [RegisteredUserController::class, 'store']);

    Route::get('login', [AuthenticatedSessionController::class, 'create'])
        ->name('login');
    Route::get('/employer/login', [AuthenticatedSessionController::class, 'employerCreate'])
        ->name('employer.login');
    Route::get('/student/login', [AuthenticatedSessionController::class, 'studentCreate'])
        ->name('student.login');
    Route::post('/remote/login', [RemoteLoginController::class, 'login'])->name('remote.login');

    Route::post('login', [AuthenticatedSessionController::class, 'store']);

    Route::get('forgot-password', [PasswordResetLinkController::class, 'create'])
        ->name('password.request');

    Route::post('forgot-password', [PasswordResetLinkController::class, 'store'])
        ->name('password.email');

    Route::get('reset-password/{token}', [NewPasswordController::class, 'create'])
        ->name('password.reset');

    Route::post('reset-password', [NewPasswordController::class, 'store'])
        ->name('password.store');
});

Route::middleware('auth')->group(function (): void {
    Route::get('verify-email', EmailVerificationPromptController::class)
        ->name('verification.notice');

    Route::get('verify-email/{id}/{hash}', VerifyEmailController::class)
        ->middleware(['signed', 'throttle:6,1'])
        ->name('verification.verify');

    Route::post('email/verification-notification', [EmailVerificationNotificationController::class, 'store'])
        ->middleware('throttle:6,1')
        ->name('verification.send');

    Route::get('confirm-password', [ConfirmablePasswordController::class, 'show'])
        ->name('password.confirm');

    Route::post('confirm-password', [ConfirmablePasswordController::class, 'store']);

    Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])
        ->name('logout');
});
