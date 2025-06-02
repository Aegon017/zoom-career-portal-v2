<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\SkillController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Employer\RegisterController;
use App\Http\Controllers\EmployerController;
use App\Http\Controllers\Employer\ProfileController;
use App\Http\Controllers\Comapny\CompanyController;
use App\Http\Controllers\JobPostingController;
use App\Http\Controllers\SavedJobPostingController;
use App\Http\Controllers\JobSeeker\DashboardController as JobSeekerDashboardController;
use App\Http\Controllers\JobSeeker\JobController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\LocationController;

Route::redirect('/', '/login');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::middleware(['ensure.employer.company.exists'])->group(function () {
        Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
        Route::resource('/users', UserController::class);
        Route::resource('/skills', SkillController::class);
        Route::resource('/job-postings', JobPostingController::class);
        Route::resource('/employers', EmployerController::class);
        Route::get('/employer/register/company', [CompanyController::class, 'create'])->name('company.register');
        Route::post('/employer/register/company', [CompanyController::class, 'store'])->name('company.register');
    });

    Route::get('/employer/user-profile-create', [RegisterController::class, 'profileCreate'])->name('employer.user-profile.create');
    Route::post('/employer/user-profile-create', [RegisterController::class, 'profileStore'])->name('employer.user-profile.create');
    Route::get('/employer/join/company', [RegisterController::class, 'joinCompany'])->name('employer.join.company');
    Route::post('/employer/company/verify', [RegisterController::class, 'companyVerify'])->name('employer.company.verify');

    Route::get('/notifications/{notificationId}/markAsRead', [NotificationController::class, 'markAsRead'])->name('notifications.markAsRead');

    Route::prefix('jobseeker')->name('jobseeker.')->group(function () {
        Route::get('/explore', [JobSeekerDashboardController::class, 'index'])->name('explore');
        Route::get('/saved-jobs', [JobSeekerDashboardController::class, 'savedJobsList'])->name('saved-jobs.index');
        Route::get('/applied-jobs', [JobSeekerDashboardController::class, 'appliedJobsList'])->name('applied-jobs.index');
        Route::get('/jobs', [JobController::class, 'index'])->name('jobs.index');
    });

    Route::get('/jobs/{jobId}', [JobController::class, 'show'])->name('jobseeker.jobs.show');
    Route::post('/job-postings/{jobPosting}/apply', [JobController::class, 'apply']);
    Route::post('/job-postings/{jobPosting}/withdraw', [JobController::class, 'withdraw']);
    Route::post('/job-postings/{jobPosting}/save', [SavedJobPostingController::class, 'save'])->name('job-postings.save');
    Route::post('/job-postings/{jobPosting}/unsave', [SavedJobPostingController::class, 'unsave'])->name('job-postings.unsave');
});

Route::get('/location/countries', [LocationController::class, 'getCountries'])->name('getCountries');
Route::post('/location/states', [LocationController::class, 'getStates'])->name('getStates');
Route::post('/location/cities', [LocationController::class, 'getCities'])->name('getCities');

Route::post('/employer/profile/image-upload', [ProfileController::class, 'uploadImage'])->name('employer.profile.image.upload');
Route::post('/employer/profile/image-remove', [ProfileController::class, 'removeImage'])->name('employer.profile.image.remove');
Route::post('/company/profile/logo-upload', [CompanyController::class, 'uploadLogo'])->name('company.profile.logo.upload');
Route::post('/company/profile/logo-remove', [CompanyController::class, 'removeLogo'])->name('company.profile.logo.remove');

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
