<?php

declare(strict_types=1);

namespace App\Http\Controllers\Jobseeker;

use App\Http\Controllers\Controller;
use App\Models\Language;
use App\Models\Location;
use App\Models\Skill;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

final class ProfileController extends Controller
{
    public function wizard()
    {
        $user = Auth::user()->load([
            'address',
            'personalDetail',
            'profile',
            'skills',
            'workPermits',
            'workExperiences.company',
            'educations',
            'certificates',
            'userLanguages.language'
        ]);

        return Inertia::render('jobseeker/profile-wizard', [
            'student' => $user,
            'skillOptions' => Skill::all()->map(fn($skill) => [
                'value' => (string) $skill->id,
                'label' => $skill->name,
            ]),
            'locations' => Location::take(100)->get()->map(fn($location) => [
                'value' => (string) $location->id,
                'label' => $location->full_name,
            ]),
            'languages' => Language::all()->map(fn($language) => [
                'value' => (string) $language->id,
                'label' => $language->name,
            ]),
        ]);
    }

    public function complete(Request $request)
    {
        $user = Auth::user();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email,' . $user->id,
            'phone' => 'nullable|string|max:20',
            'address.location_id' => 'nullable|exists:locations,id',
            'personal_detail.gender' => 'required|string|in:Male,Female,Other',
            'personal_detail.date_of_birth' => 'nullable|date|before:today',
            'personal_detail.marital_status' => 'nullable|string|in:Single/unmarried,Married',
            'personal_detail.differently_abled' => 'boolean',
            'profile.job_title' => 'nullable|string|max:255',
            'profile.experience' => 'nullable|string|max:255',
            'profile.notice_period' => 'nullable|string|max:255',
            'skills' => 'nullable|array',
            'skills.*' => 'exists:skills,id',
            'work_permits' => 'nullable|array',
            'work_permits.*' => 'string|max:255',
            'work_experiences' => 'nullable|array',
            'work_experiences.*.title' => 'required|string|max:255',
            'work_experiences.*.company_name' => 'nullable|string|max:255',
            'work_experiences.*.start_date' => 'required|date',
            'work_experiences.*.end_date' => 'nullable|date|after_or_equal:work_experiences.*.start_date',
            'work_experiences.*.is_current' => 'boolean',
            'educations' => 'nullable|array',
            'educations.*.course_title' => 'required|string|max:255',
            'educations.*.institution' => 'required|string|max:255',
            'educations.*.start_date' => 'required|date',
            'educations.*.end_date' => 'nullable|date|after_or_equal:educations.*.start_date',
            'educations.*.is_current' => 'boolean',
            'educations.*.course_type' => 'nullable|string|in:Full-time,Part-time,Online',
            'certificates' => 'nullable|array',
            'certificates.*.name' => 'required|string|max:255',
            'user_languages' => 'nullable|array',
            'user_languages.*.language_id' => 'required|exists:languages,id',
            'user_languages.*.proficiency' => 'required|string|in:basic,intermediate,advanced,native',
            'user_languages.*.can_read' => 'boolean',
            'user_languages.*.can_write' => 'boolean',
            'user_languages.*.can_speak' => 'boolean',
        ]);

        DB::transaction(function () use ($validated, $user, $request) {
            $user->update($request->only(['name', 'email', 'phone']));

            $this->updateAddress($user, $validated);
            $this->updatePersonalDetail($user, $validated);
            $this->updateProfile($user, $validated);
            $this->updateSkills($user, $validated);
            $this->updateWorkPermits($user, $validated);
            $this->updateWorkExperiences($user, $validated);
            $this->updateEducations($user, $validated);
            $this->updateCertificates($user, $validated);
            $this->updateUserLanguages($user, $validated);
        });

        return redirect()->route('jobseeker.dashboard')->with('success', 'Profile updated successfully.');
    }

    private function updateAddress(User $user, array $validated): void
    {
        if (!empty($validated['address']['location_id'])) {
            $user->address()->updateOrCreate(
                [
                    'addressable_id' => $user->id,
                    'addressable_type' => User::class,
                ],
                [
                    'location_id' => (int) $validated['address']['location_id']
                ]
            );
        }
    }

    private function updatePersonalDetail(User $user, array $validated): void
    {
        if (isset($validated['personal_detail'])) {
            $personalDetailData = $validated['personal_detail'];

            if (!empty($personalDetailData['date_of_birth'])) {
                $personalDetailData['date_of_birth'] = Carbon::parse($personalDetailData['date_of_birth'])->format('Y-m-d');
            } else {
                $personalDetailData['date_of_birth'] = null;
            }

            $user->personalDetail()->updateOrCreate(
                ['user_id' => $user->id],
                $personalDetailData
            );
        }
    }

    private function updateProfile(User $user, array $validated): void
    {
        if (isset($validated['profile'])) {
            $profileData = array_filter($validated['profile'], fn($value) => !empty($value));

            if (!empty($profileData)) {
                $user->profile()->updateOrCreate(
                    ['user_id' => $user->id],
                    $profileData
                );
            }
        }
    }

    private function updateSkills(User $user, array $validated): void
    {
        if (!empty($validated['skills'])) {
            $user->skills()->sync(array_map('intval', $validated['skills']));
        }
    }

    private function updateWorkPermits(User $user, array $validated): void
    {
        if (!empty($validated['work_permits'])) {
            $user->workPermits()->delete();

            $workPermits = array_map(
                fn($country) => ['country' => $country],
                array_filter($validated['work_permits'], fn($country) => !empty($country))
            );

            $user->workPermits()->createMany($workPermits);
        }
    }

    private function updateWorkExperiences(User $user, array $validated): void
    {
        if (!empty($validated['work_experiences'])) {
            $user->workExperiences()->delete();

            $workExperiences = array_map(function ($experience) {
                $endDate = (!empty($experience['end_date']) && !($experience['is_current'] ?? false))
                    ? Carbon::parse($experience['end_date'])->format('Y-m-d')
                    : null;

                return [
                    'title' => $experience['title'],
                    'company_name' => $experience['company_name'] ?? null,
                    'start_date' => Carbon::parse($experience['start_date'])->format('Y-m-d'),
                    'end_date' => $endDate,
                    'is_current' => $experience['is_current'] ?? false,
                ];
            }, $validated['work_experiences']);

            $user->workExperiences()->createMany($workExperiences);
        }
    }

    private function updateEducations(User $user, array $validated): void
    {
        if (!empty($validated['educations'])) {
            $user->educations()->delete();

            $educations = array_map(function ($education) {
                $endDate = (!empty($education['end_date']) && !($education['is_current'] ?? false))
                    ? Carbon::parse($education['end_date'])->format('Y-m-d')
                    : null;

                return [
                    'course_title' => $education['course_title'],
                    'institution' => $education['institution'],
                    'start_date' => Carbon::parse($education['start_date'])->format('Y-m-d'),
                    'end_date' => $endDate,
                    'is_current' => $education['is_current'] ?? false,
                    'course_type' => $education['course_type'] ?? null,
                ];
            }, $validated['educations']);

            $user->educations()->createMany($educations);
        }
    }

    private function updateCertificates(User $user, array $validated): void
    {
        if (!empty($validated['certificates'])) {
            $user->certificates()->delete();

            $certificates = array_map(
                fn($certificate) => ['name' => $certificate['name']],
                array_filter($validated['certificates'], fn($certificate) => !empty($certificate['name']))
            );

            $user->certificates()->createMany($certificates);
        }
    }

    private function updateUserLanguages(User $user, array $validated): void
    {
        if (!empty($validated['user_languages'])) {
            $user->userLanguages()->delete();

            $userLanguages = array_map(function ($language) {
                return [
                    'language_id' => (int) $language['language_id'],
                    'proficiency' => $language['proficiency'],
                    'can_read' => $language['can_read'] ?? false,
                    'can_write' => $language['can_write'] ?? false,
                    'can_speak' => $language['can_speak'] ?? false,
                ];
            }, $validated['user_languages']);

            $user->userLanguages()->createMany($userLanguages);
        }
    }

    public function show(User $user)
    {
        $user->load([
            'followers',
            'followingUsers',
            'followingCompanies',
            'skills',
            'workExperiences',
            'workExperiences.company',
            'profile',
            'address',
            'address.location',
            'workPermits',
            'personalDetail',
            'userLanguages',
            'userLanguages.language',
            'certificates',
            'educations'
        ]);

        return Inertia::render('jobseeker/profile', compact('user'));
    }
}
