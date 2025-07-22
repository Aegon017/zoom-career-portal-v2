<?php

declare(strict_types=1);

use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\CompanyController;
use App\Http\Controllers\Admin\EmployerVerifyController;
use App\Http\Controllers\Admin\IndustryController;
use App\Http\Controllers\Admin\JobController;
use App\Http\Controllers\Admin\JobVerifyController;
use App\Http\Controllers\Admin\LanguageController;
use App\Http\Controllers\Admin\LocationController as AdminLocationController;
use App\Http\Controllers\Admin\OpeningTitleController;
use App\Http\Controllers\Admin\SiteSettingController;
use App\Http\Controllers\Admin\SkillController;
use App\Http\Controllers\Admin\StudentVerificationController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\AdminEmployeeController;
use App\Http\Controllers\Employer\ApplicationsController;
use App\Http\Controllers\Employer\CandidateMatchController;
use App\Http\Controllers\Employer\CompanyController as EmployerCompanyController;
use App\Http\Controllers\Employer\EmployerDashboardController;
use App\Http\Controllers\Employer\JobDescriptionStreamController;
use App\Http\Controllers\Employer\JobseekerController;
use App\Http\Controllers\Employer\OnboardingController;
use App\Http\Controllers\Employer\OpeningController;
use App\Http\Controllers\EmployerManageProfileController;
use App\Http\Controllers\FollowController;
use App\Http\Controllers\InboxController as ControllersInboxController;
use App\Http\Controllers\JobApplicationController;
use App\Http\Controllers\JobSaveController;
use App\Http\Controllers\Jobseeker\CareerInterestController;
use App\Http\Controllers\Jobseeker\EmployerController;
use App\Http\Controllers\Jobseeker\JobseekerDashboardController;
use App\Http\Controllers\Jobseeker\PeopleController;
use App\Http\Controllers\Jobseeker\ProfileController;
use App\Http\Controllers\Jobseeker\ResumeController;
use App\Http\Controllers\JobseekerJobController;
use App\Http\Controllers\LocationController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\OtpController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\TempUploadController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', fn() => view('home'))->name('home');

Route::redirect('/admin', '/admin/login');

Route::get('/admin/login', fn() => Inertia::render('auth/admin-login'))->name('admin.login');

Route::middleware('employer.onboarding')->get('/account/verification/notice', fn() => Inertia::render('account-verification-notice'))->name('account.verification.notice');
Route::middleware('auth')->get('/student/verification/notice', fn() => Inertia::render('student-verification-notice'))->name('student.verification.notice');

// temporary file upload routes
Route::post('/temp-upload', [TempUploadController::class, 'store']);
Route::post('/temp-upload/remove', [TempUploadController::class, 'destroy']);

// location api routes
Route::get('/location/countries', [LocationController::class, 'getCountries'])->name('getCountries');
Route::post('/location/states', [LocationController::class, 'getStates'])->name('getStates');
Route::post('/location/cities', [LocationController::class, 'getCities'])->name('getCities');
Route::get('/locations/search', [LocationController::class, 'search']);
Route::get('/skills/search', [SkillController::class, 'search']);
Route::get('/companies', [CompanyController::class, 'search']);
Route::get('/industries/search', [IndustryController::class, 'search']);
Route::get('/languages/search', [LanguageController::class, 'search']);

Route::middleware(['auth', 'verified'])->group(function (): void {
    // otp routes
    Route::get('/otp', [OtpController::class, 'index'])->name('otp.index');
    Route::post('/otp/send', [OtpController::class, 'send'])->name('otp.send');
    Route::post('/otp/verify', [OtpController::class, 'verify'])->name('otp.verify');

    // follow routes
    Route::post('/follow', [FollowController::class, 'follow'])->name('follow');
    Route::post('/unfollow', [FollowController::class, 'unfollow'])->name('unfollow');
    Route::post('/follow/toggle', [FollowController::class, 'toggle'])->middleware('auth')->name('follow.toggle');

    // notification routes
    Route::get('/notifications/{notificationId}/markAsRead', [NotificationController::class, 'markAsRead'])->name('notifications.markAsRead');

    // employer routes
    Route::middleware('role:employer|super_admin')->prefix('employer')->name('employer.')->group(function (): void {
        Route::get('/dashboard', [EmployerDashboardController::class, 'index'])->middleware(['employer_is_verified'])->name('dashboard');
        Route::middleware('employer_is_verified')->resource('/jobs', OpeningController::class);

        // on-boarding routes
        Route::middleware('employer.onboarding')->prefix('on-boarding')->name('on-boarding.')->group(function (): void {
            // profile and company setup
            Route::prefix('setup')->name('setup.')->group(function (): void {
                Route::get('/profile', [OnboardingController::class, 'setupProfile'])->name('profile');
                Route::post('/profile', [OnboardingController::class, 'storeProfile'])->name('profile.store');
                Route::get('/company/new', [OnboardingController::class, 'setupCompany'])->name('company');
                Route::post('/company', [OnboardingController::class, 'storeCompany'])->name('company.store');
                Route::get('/company/verification-pending', [OnboardingController::class, 'setupVerificationPending'])->name('company.verification.pending');
            });
            Route::prefix('company')->name('company.')->group(function (): void {
                Route::get('/create-or-join', [OnboardingController::class, 'companyCreateOrJoin'])->middleware('verified.phone')->name('create-or-join');
                Route::post('/create-or-join', [OnboardingController::class, 'handleCompanyCreateOrJoin'])->name('create-or-join.handle');
                Route::get('/verification-pending', [OnboardingController::class, 'joinVerificationPending'])->name('join.verification.pending');
            });
        });

        Route::get('/company', (new EmployerCompanyController())->index(...))->name('company.index');
        Route::get('/company/edit', (new EmployerCompanyController())->edit(...))->name('company.edit');
        Route::put('/company/{company}', (new EmployerCompanyController())->update(...))->name('company.update');

        Route::resource('/manage-profile', EmployerManageProfileController::class);
        Route::post('/profile/experience', [EmployerManageProfileController::class, 'storeExperience'])->name('profile.experience.store');
        Route::patch('/dashboard/profile', [EmployerManageProfileController::class, 'updateProfile'])->name('dashboard.profile.update');
        Route::middleware(['auth', 'role:employer'])->put('/profile/banner', [EmployerManageProfileController::class, 'updateBanner'])->name('profile.banner.update');

        Route::prefix('/jobseekers')->name('jobseekers.')->group(function (): void {
            Route::get('/', [JobseekerController::class, 'index'])->name('index');
        });

        Route::prefix('/applications')->name('applications.')->group(function (): void {
            Route::get('/', [ApplicationsController::class, 'index'])->name('index');
            Route::post('/', [ApplicationsController::class, 'store'])->name('store');
        });

        Route::post('/ai/job-description', [JobDescriptionStreamController::class, 'stream']);
        Route::get('/ai/match-score/{application}', [CandidateMatchController::class, 'score']);
    });

    // jobseeker routes
    Route::middleware('role:jobseeker')->prefix('jobseeker')->name('jobseeker.')->group(function (): void {
        Route::get('/explore', [JobseekerDashboardController::class, 'index'])->name('explore.index');
        Route::get('/profile/{user}', [ProfileController::class, 'show'])->name('profile.show');
        Route::post('/profile/basic-details', [ProfileController::class, 'storeBasicDetails'])->name('profile.basic-details.store');
        Route::post('/profile/skills', [ProfileController::class, 'storeSkills'])->name('profile.skills.store');
        Route::post('/profile/summary', [ProfileController::class, 'storeSummary'])->name('profile.summary.store');
        Route::post('/profile/employments', [ProfileController::class, 'storeEmployments'])->name('profile.employments.store');
        Route::post('/profile/educations', [ProfileController::class, 'storeEducations'])->name('profile.educations.store');
        Route::post('/profile/personal-details', [ProfileController::class, 'storePersonalDetails'])->name('profile.personal-details.store');
        Route::post('/profile/languages', [ProfileController::class, 'storeLanguages'])->name('profile.languages.store');
        Route::post('/profile/certificates', [ProfileController::class, 'storeCertificates'])->name('profile.certificates.store');
        Route::prefix('/jobs')->name('jobs.')->group(function (): void {
            Route::get('/', [JobseekerJobController::class, 'index'])->name('index');
            Route::get('/your/saved/', [JobseekerJobController::class, 'savedJobs'])->name('saved.index');
            Route::get('/your/applied/', [JobseekerJobController::class, 'appliedJobs'])->name('applied.index');
            Route::get('/{jobId}', [JobseekerJobController::class, 'show'])->name('show');
            Route::post('/{jobId}/save', [JobSaveController::class, 'store'])->name('save');
            Route::post('/{jobId}/unsave', [JobSaveController::class, 'destroy'])->name('unsave');
            Route::post('/{jobId}/apply', [JobApplicationController::class, 'store'])->name('apply');
            Route::post('/{job}/withdraw', [JobApplicationController::class, 'destroy'])->name('withdraw');
        });
        Route::get('/resumes', [ResumeController::class, 'index'])->name('resumes.index');
        Route::get('/resumes/data', [ResumeController::class, 'data'])->name('resumes.data');
        Route::post('/resumes', [ResumeController::class, 'store'])->name('resumes.store');
        Route::delete('/resumes/destroy/{id}', [ResumeController::class, 'destroy'])->name('resumes.destroy');
        Route::get('/people', [PeopleController::class, 'index'])->name('people.index');
        Route::get('/employers', [EmployerController::class, 'index'])->name('employers.index');
        Route::get('/employers/{company}', [EmployerController::class, 'show'])->name('employers.show');
        Route::get('/career-interests', [CareerInterestController::class, 'index'])->name('career-interests.index');
        Route::post('/career-interests/update', [CareerInterestController::class, 'update'])->name('career-interests.update');
    });

    // admin routes
    Route::middleware('role:super_admin')->prefix('admin')->name('admin.')->group(function (): void {
        Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');
        Route::resource('/roles', RoleController::class);
        Route::resource('/job-titles', OpeningTitleController::class);
        Route::resource('/skills', SkillController::class);
        Route::resource('/users', UserController::class);
        Route::resource('/employees', AdminEmployeeController::class);
        Route::resource('/companies', CompanyController::class);
        Route::resource('/jobs', JobController::class);
        Route::get('/jobs/{job}/applications', [JobController::class, 'applications'])->name('jobs.applications.index');
        Route::post('/jobs/{job}/applications', [JobController::class, 'storeApplications'])->name('jobs.applications.store');
        Route::get('/employer/verify', [EmployerVerifyController::class, 'verify'])->name('employer.verify');
        Route::post('/employer/verify', [EmployerVerifyController::class, 'store'])->name('employer.verify.store');
        Route::get('/job/verify', [JobVerifyController::class, 'verify'])->name('job.verify');
        Route::post('/job/verify/{opening}', [JobVerifyController::class, 'store'])->name('job.verify.store');

        Route::resource('/industries', IndustryController::class);
        Route::resource('/locations', AdminLocationController::class);
        Route::resource('/languages', LanguageController::class);

        Route::get('/site-settings', [SiteSettingController::class, 'index'])->name('site.settings');
        Route::post('/site-settings', [SiteSettingController::class, 'store'])->name('site.settings.store');
        Route::get('/students/verify/{student}', [StudentVerificationController::class, 'show'])->name('students.verify');
        Route::post('/students/verify/{student}', [StudentVerificationController::class, 'verify'])->name('students.verify.approve');
        Route::delete('/students/reject/{student}', [StudentVerificationController::class, 'reject'])->name('students.verify.reject');
    });

    Route::get('/inbox', (new ControllersInboxController())->index(...))->name('inbox.index');
    Route::post('/inbox/send-message', (new ControllersInboxController())->sendMessage(...))->name('inbox.send-message');
});

Route::middleware('auth')->get('/notifications', fn(Request $request) => $request->user()->unreadNotifications()->latest()->get());

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
