<?php

declare(strict_types=1);

use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\OpeningTitleController;
use App\Http\Controllers\Admin\SkillController;
use App\Http\Controllers\Admin\TalentProfileController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\AdminCompanyController;
use App\Http\Controllers\AdminEmployeeController;
use App\Http\Controllers\AdminEmployerVerifyController;
use App\Http\Controllers\Employer\EmployerDashboardController;
use App\Http\Controllers\Employer\EmployerOnBoardingController;
use App\Http\Controllers\Employer\InboxController;
use App\Http\Controllers\Employer\JobseekerController;
use App\Http\Controllers\Employer\OpeningController;
use App\Http\Controllers\EmployerManageProfileController;
use App\Http\Controllers\FollowController;
use App\Http\Controllers\JobApplicationController;
use App\Http\Controllers\JobSaveController;
use App\Http\Controllers\Jobseeker\JobseekerDashboardController;
use App\Http\Controllers\Jobseeker\JobseekerProfileController;
use App\Http\Controllers\JobseekerJobController;
use App\Http\Controllers\JobseekerResumeController;
use App\Http\Controllers\LocationController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\TempUploadController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Home route
Route::redirect('/', '/login');
Route::redirect('/admin', '/admin/dashboard');

Route::get('/account/verification/notice', function () {
    return Inertia::render('account-verification-notice');
})->name('account.verification.notice');

// temporary file upload routes
Route::post('/temp-upload', [TempUploadController::class, 'store']);
Route::post('/temp-upload/remove', [TempUploadController::class, 'destroy']);

// location api routes
Route::get('/location/countries', [LocationController::class, 'getCountries'])->name('getCountries');
Route::post('/location/states', [LocationController::class, 'getStates'])->name('getStates');
Route::post('/location/cities', [LocationController::class, 'getCities'])->name('getCities');

Route::middleware(['auth', 'verified'])->group(function () {
    // follow routes
    Route::post('/follow', [FollowController::class, 'follow'])->name('follow');
    Route::post('/unfollow', [FollowController::class, 'unfollow'])->name('unfollow');
    Route::post('/follow/toggle', [FollowController::class, 'toggle'])->middleware('auth')->name('follow.toggle');

    // notification routes
    Route::get('/notifications/{notificationId}/markAsRead', [NotificationController::class, 'markAsRead'])->name('notifications.markAsRead');

    // employer routes
    Route::middleware('role:employer')->prefix('employer')->name('employer.')->group(function () {
        Route::get('/dashboard', [EmployerDashboardController::class, 'index'])->middleware(['employer_is_verified'])->name('dashboard');
        Route::middleware('employer_is_verified')->resource('/jobs', OpeningController::class);

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
        Route::prefix('inbox')->name('inbox.')->group(function () {
            Route::get('/', [InboxController::class, 'index'])->name('index');
        });

        Route::resource('/manage-profile', EmployerManageProfileController::class);
        Route::post('/profile/experience', [EmployerManageProfileController::class, 'storeExperience'])->name('profile.experience.store');
        Route::patch('/dashboard/profile', [EmployerManageProfileController::class, 'updateProfile'])->name('dashboard.profile.update');
        Route::middleware(['auth', 'role:employer'])->put('/profile/banner', [EmployerManageProfileController::class, 'updateBanner'])->name('profile.banner.update');
        Route::get('/jobs/{jobId}/applications', [JobApplicationController::class, 'index'])->name('jobs.applications');

        Route::prefix('/jobseekers')->name('jobseekers.')->group(function () {
            Route::get('/', [JobseekerController::class, 'index'])->name('index');
        });
    });

    // jobseeker routes
    Route::middleware('role:jobseeker')->prefix('jobseeker')->name('jobseeker.')->group(function () {
        Route::get('/explore', [JobseekerDashboardController::class, 'index'])->name('explore');
        Route::get('/profile', [JobseekerProfileController::class, 'index'])->name('profile.index');
        Route::prefix('/jobs')->name('jobs.')->group(function () {
            Route::get('/', [JobseekerJobController::class, 'index'])->name('index');
            Route::get('/your/saved/', [JobseekerJobController::class, 'savedJobs'])->name('saved.index');
            Route::get('/your/applied/', [JobseekerJobController::class, 'appliedJobs'])->name('applied.index');
            Route::get('/{jobId}', [JobseekerJobController::class, 'show'])->name('show');
            Route::post('/{jobId}/save', [JobSaveController::class, 'store'])->name('save');
            Route::post('/{jobId}/unsave', [JobSaveController::class, 'destroy'])->name('unsave');
            Route::post('/{jobId}/apply', [JobApplicationController::class, 'store'])->name('apply');
            Route::post('/{job}/withdraw', [JobApplicationController::class, 'destroy'])->name('withdraw');
        });
        Route::get('/resumes', [JobseekerResumeController::class, 'index'])->name('resumes.index');
        Route::get('/resumes/data', [JobseekerResumeController::class, 'data'])->name('resumes.data');
        Route::post('/resumes', [JobseekerResumeController::class, 'store'])->name('resumes.store');
        Route::delete('/resumes/destroy/{id}', [JobseekerResumeController::class, 'destroy'])->name('resumes.destroy');
    });

    // admin routes
    Route::middleware('role:super_admin')->prefix('admin')->name('admin.')->group(function () {
        Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');
        Route::resource('/job-titles', OpeningTitleController::class);
        Route::resource('/talent-profiles', TalentProfileController::class);
        Route::resource('/skills', SkillController::class);
        Route::resource('/users', UserController::class);
        Route::resource('/employee', AdminEmployeeController::class);
        Route::resource('/companies', AdminCompanyController::class);
        Route::get('/employer/verify', [AdminEmployerVerifyController::class, 'verify'])->name('employer.verify');
        Route::post('/employer/verify', [AdminEmployerVerifyController::class, 'store'])->name('employer.verify.store');
    });
});

Route::middleware('auth')->get('/notifications', function (Request $request) {
    return $request->user()->unreadNotifications()->latest()->get();
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
