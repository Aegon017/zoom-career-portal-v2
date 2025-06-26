<?php

declare(strict_types=1);

use App\Http\Controllers\Settings\EmployerPasswordController;
use App\Http\Controllers\Settings\EmployerProfileController;
use App\Http\Controllers\Settings\PasswordController;
use App\Http\Controllers\Settings\ProfileController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth')->group(function (): void {
    Route::redirect('settings', 'settings/profile');

    Route::get('settings/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('settings/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('settings/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('settings/password', [PasswordController::class, 'edit'])->name('password.edit');
    Route::put('settings/password', [PasswordController::class, 'update'])->name('password.update');
});

Route::middleware('auth')->prefix('employer')->name('employer.')->group(function (): void {
    Route::redirect('settings', 'settings/profile');

    Route::get('settings/profile', [EmployerProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('settings/profile', [EmployerProfileController::class, 'update'])->name('profile.update');
    Route::delete('settings/profile', [EmployerProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('settings/password', [EmployerPasswordController::class, 'edit'])->name('password.edit');
    Route::put('settings/password', [EmployerPasswordController::class, 'update'])->name('password.update');
});
