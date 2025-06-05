<?php

declare(strict_types=1);

use App\Http\Controllers\Admin\JobTitleController;
use App\Http\Controllers\Admin\SkillController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\AdminDashboardController;
use App\Http\Controllers\EmployerController;
use App\Http\Controllers\EmployerOnBoardingController;
use App\Http\Controllers\JobPostingController;
use App\Http\Controllers\JobSeeker\DashboardController as JobSeekerDashboardController;
use App\Http\Controllers\JobSeeker\JobController;
use App\Http\Controllers\JobSeekerProfileController;
use App\Http\Controllers\LocationController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\SavedJobPostingController;
use App\Http\Controllers\TalentProfileController;
use App\Http\Controllers\TempUploadController;
use App\Models\EmployerDasboardController;
use Illuminate\Support\Facades\Route;

// Home route
Route::redirect('/', '/login');

// temporary file upload routes
Route::post('/temp-upload', [TempUploadController::class, 'store']);
Route::post('/temp-upload/remove', [TempUploadController::class, 'destroy']);

// location api routes
Route::get('/location/countries', [LocationController::class, 'getCountries'])->name('getCountries');
Route::post('/location/states', [LocationController::class, 'getStates'])->name('getStates');
Route::post('/location/cities', [LocationController::class, 'getCities'])->name('getCities');

Route::middleware(['auth', 'verified'])->group(function () {
    // notification routes
    Route::get('/notifications/{notificationId}/markAsRead', [NotificationController::class, 'markAsRead'])->name('notifications.markAsRead');

    // employer routes
    Route::middleware('role:employer')->prefix('employer')->name('employer.')->group(function () {
        // Route::get('/dashboard', [EmployerDasboardController::class, 'index'])->middleware('employer.onboarding')->name('dashboard');
        // on-boarding routes
        Route::middleware('employer.onboarding')->prefix('on-boarding')->name('on-boarding.')->group(function () {
            // profile and company setup
            Route::prefix('setup')->name('setup.')->group(function () {
                Route::get('/profile', [EmployerOnBoardingController::class, 'setupProfile'])->name('profile');
                Route::post('/profile', [EmployerOnBoardingController::class, 'storeProfile'])->name('profile.store');
                Route::get('/company/new', [EmployerOnBoardingController::class, 'setupCompany'])->name('company');
                Route::post('/company', [EmployerOnBoardingController::class, 'storeCompany'])->name('company.store');
                Route::get('/company/verification-pending', [EmployerOnBoardingController::class, 'setupVerificationPending'])->name('company.verification.pending');
            });
            Route::prefix('company')->name('company.')->group(function () {
                Route::get('/create-or-join', [EmployerOnBoardingController::class, 'companyCreateOrJoin'])->name('create-or-join');
                Route::post('/create-or-join', [EmployerOnBoardingController::class, 'handleCompanyCreateOrJoin'])->name('create-or-join.handle');
                Route::get('/verification-pending', [EmployerOnBoardingController::class, 'joinVerificationPending'])->name('join.verification.pending');
            });
        });
    });

    // jobseeker routes
    Route::middleware('role:jobseeker')->prefix('jobseeker')->name('jobseeker.')->group(function () {
        Route::get('/explore', [JobSeekerDashboardController::class, 'index'])->name('explore');
        Route::get('/saved-jobs', [JobSeekerDashboardController::class, 'savedJobsList'])->name('saved-jobs.index');
        Route::get('/applied-jobs', [JobSeekerDashboardController::class, 'appliedJobsList'])->name('applied-jobs.index');
        Route::get('/jobs', [JobController::class, 'index'])->name('jobs.index');
        Route::resource('/profile', JobSeekerProfileController::class);
        Route::get('/jobs/{jobId}', [JobController::class, 'show'])->name('jobs.show');
        Route::post('/job-postings/{jobPosting}/apply', [JobController::class, 'apply']);
        Route::post('/job-postings/{jobPosting}/withdraw', [JobController::class, 'withdraw']);
        Route::post('/job-postings/{jobPosting}/save', [SavedJobPostingController::class, 'save'])->name('job-postings.save');
        Route::post('/job-postings/{jobPosting}/unsave', [SavedJobPostingController::class, 'unsave'])->name('job-postings.unsave');
    });

    // admin routes
    Route::middleware('role:super_admin')->prefix('admin')->name('admin.')->group(function () {
        Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');
        Route::resource('/users', UserController::class);
        Route::resource('/job-titles', JobTitleController::class);
        Route::resource('/talent-profiles', TalentProfileController::class);
        Route::resource('/skills', SkillController::class);
        Route::resource('/job-postings', JobPostingController::class);
        Route::resource('/employers', EmployerController::class);
    });
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
