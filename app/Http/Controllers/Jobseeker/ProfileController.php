<?php

declare(strict_types=1);

namespace App\Http\Controllers\Jobseeker;

use App\Http\Controllers\Controller;
use App\Models\Certificate;
use App\Models\Education;
use App\Models\Language;
use App\Models\Location;
use App\Models\Skill;
use App\Models\User;
use App\Models\UserLanguage;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
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
            'userLanguages.language',
        ]);

        return Inertia::render('jobseeker/profile-wizard', [
            'student' => $user,
            'skillOptions' => Skill::all()->map(fn ($skill): array => [
                'value' => (string) $skill->id,
                'label' => $skill->name,
            ]),
            'locations' => Location::take(100)->get()->map(fn ($location): array => [
                'value' => (string) $location->id,
                'label' => $location->full_name,
            ]),
            'languages' => Language::all()->map(fn ($language): array => [
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
            'email' => 'required|email|max:255|unique:users,email,'.$user->id,
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
            'certificates.*.number' => 'required|string|max:255',
            'user_languages' => 'nullable|array',
            'user_languages.*.language_id' => 'required|exists:languages,id',
            'user_languages.*.proficiency' => 'required|string',
            'user_languages.*.can_read' => 'boolean',
            'user_languages.*.can_write' => 'boolean',
            'user_languages.*.can_speak' => 'boolean',
        ]);

        DB::transaction(function () use ($validated, $user, $request): void {
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
            'educations',
        ]);

        return Inertia::render('jobseeker/profile', ['user' => $user]);
    }

    public function storeBasicDetails(Request $request)
    {
        $user = Auth::user();

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:20'],
            'avatar' => ['nullable', 'string'],
            'location_id' => ['nullable', 'integer', 'exists:locations,id'],
            'experience' => ['nullable', 'string', 'max:255'],
            'notice_period' => ['nullable', 'string', 'max:255'],
            'job_title' => ['nullable', 'string', 'max:255'],
        ]);

        $user->update([
            'name' => $data['name'],
            'email' => $data['email'],
            'phone' => $data['phone'],
        ]);

        if (! empty($data['avatar']) && Storage::exists($data['avatar'])) {
            $user->addMediaFromDisk($data['avatar'])->toMediaCollection('avatars');
        }

        $user->address()->updateOrCreate([], [
            'location_id' => $data['location_id'],
        ]);

        $user->profile()->updateOrCreate([], [
            'job_title' => $data['job_title'],
            'experience' => $data['experience'],
            'notice_period' => $data['notice_period'],
        ]);

        return back()->with('success', 'Profile updated successfully.');
    }

    public function storeSummary(Request $request)
    {

        $data = $request->validate([
            'summary' => 'required|string',
        ]);

        $user = Auth::user();

        $user->profile()->update([
            'summary' => $data['summary'],
        ]);

        return back()->with('success', 'succesfully updated your summary');
    }

    public function storeSkills(Request $request)
    {
        $user = Auth::user();

        $data = $request->validate([
            'skills' => 'required|array',
            'skills.*' => 'string|max:255',
        ]);

        $skillIds = [];
        foreach ($data['skills'] as $skillName) {
            $skill = Skill::firstOrCreate(['name' => $skillName]);
            $skillIds[] = $skill->id;
        }

        $user->skills()->sync($skillIds);

        return back()->with('success', 'Successfully updated your skills');
    }

    public function storeEmployments(Request $request)
    {
        $user = Auth::user();

        $validated = $request->validate([
            'work_experiences' => 'required|array',
            'work_experiences.*.company_id' => 'nullable|integer|exists:companies,id',
            'work_experiences.*.company_name' => 'nullable|string|max:255',
            'work_experiences.*.title' => 'required|string|max:255',
            'work_experiences.*.start_date' => 'nullable|date',
            'work_experiences.*.end_date' => 'nullable|date|after_or_equal:work_experiences.*.start_date',
            'work_experiences.*.is_current' => 'required|boolean',
        ]);

        DB::transaction(function () use ($user, $validated): void {
            $user->workExperiences()->delete();

            foreach ($validated['work_experiences'] as $we) {
                $user->workExperiences()->create([
                    'company_id' => $we['company_id'],
                    'company_name' => $we['company_id'] === null ? $we['company_name'] : null,
                    'title' => $we['title'],
                    'start_date' => $we['start_date'],
                    'end_date' => $we['is_current'] ? null : $we['end_date'],
                    'is_current' => $we['is_current'],
                ]);
            }
        });

        return back()->with('success', 'Work experiences updated successfully.');
    }

    public function storeEducations(Request $request)
    {
        $validated = $request->validate([
            'educations' => 'required|array',
            'educations.*.course_title' => 'required|string|max:255',
            'educations.*.institution' => 'required|string|max:255',
            'educations.*.start_date' => 'required|date',
            'educations.*.end_date' => 'nullable|date',
            'educations.*.is_current' => 'required|boolean',
            'educations.*.course_type' => 'required|string|max:255',
        ]);

        $user = Auth::user();
        $educationIds = [];

        foreach ($validated['educations'] as $edu) {
            $education = Education::updateOrCreate(
                [
                    'user_id' => $user->id,
                    'course_title' => $edu['course_title'],
                    'institution' => $edu['institution'],
                ],
                [
                    'start_date' => $edu['start_date'],
                    'end_date' => $edu['is_current'] ? null : $edu['end_date'],
                    'is_current' => $edu['is_current'],
                    'course_type' => $edu['course_type'],
                ]
            );

            $educationIds[] = $education->id;
        }

        Education::where('user_id', $user->id)
            ->whereNotIn('id', $educationIds)
            ->delete();

        return back()->with('success', 'Education history updated successfully.');
    }

    public function storePersonalDetails(Request $request)
    {
        $validated = $request->validate([
            'gender' => 'required|string',
            'date_of_birth' => 'required|date',
            'location_id' => 'required|integer|exists:locations,id',
            'marital_status' => 'required|string',
            'work_permit' => 'required|array',
            'work_permit.*' => 'string',
            'differently_abled' => 'required|boolean',
        ]);

        $user = Auth::user();

        $user->personalDetail()->updateOrCreate(
            ['user_id' => $user->id],
            collect($validated)->except('location_id')->toArray()
        );

        $user->address()->updateOrCreate(
            [],
            ['location_id' => $validated['location_id']]
        );

        $user->workPermits()->delete();
        foreach ($validated['work_permit'] as $country) {
            $user->workPermits()->create(['country' => $country]);
        }

        return redirect()->back()->with('success', 'personal details updated successfully.');
    }

    public function storeLanguages(Request $request)
    {
        $data = $request->validate([
            'languages' => 'required|array',
            'languages.*.language_id' => 'required|integer|exists:languages,id',
            'languages.*.proficiency' => 'required|string',
            'languages.*.can_read' => 'nullable|boolean',
            'languages.*.can_write' => 'nullable|boolean',
            'languages.*.can_speak' => 'nullable|boolean',
        ]);

        $user = Auth::user();
        $userLanguageIds = [];

        foreach ($data['languages'] as $langData) {
            $userLanguage = UserLanguage::updateOrCreate(
                [
                    'user_id' => $user->id,
                    'language_id' => $langData['language_id'],
                ],
                [
                    'proficiency' => $langData['proficiency'],
                    'can_read' => $langData['can_read'] ?? false,
                    'can_write' => $langData['can_write'] ?? false,
                    'can_speak' => $langData['can_speak'] ?? false,
                ]
            );

            $userLanguageIds[] = $userLanguage->id;
        }

        UserLanguage::where('user_id', $user->id)
            ->whereNotIn('id', $userLanguageIds)
            ->delete();

        return back()->with('success', 'Languages updated successfully.');
    }

    public function storeCertificates(Request $request)
    {
        $data = $request->validate([
            'certifications' => 'required|array',
            'certifications.*.name' => 'required|string|max:255',
        ]);

        $user = Auth::user();
        $certificateIds = [];

        foreach ($data['certifications'] as $cert) {
            $certificate = Certificate::updateOrCreate(
                [
                    'user_id' => $user->id,
                    'name' => $cert['name'],
                ],
                []
            );
            $certificateIds[] = $certificate->id;
        }

        Certificate::where('user_id', $user->id)
            ->whereNotIn('id', $certificateIds)
            ->delete();

        return back()->with('success', 'Certificates updated successfully.');
    }

    private function updateAddress(User $user, array $validated): void
    {
        if (! empty($validated['address']['location_id'])) {
            $user->address()->updateOrCreate(
                [
                    'addressable_id' => $user->id,
                    'addressable_type' => User::class,
                ],
                [
                    'location_id' => (int) $validated['address']['location_id'],
                ]
            );
        }
    }

    private function updatePersonalDetail(User $user, array $validated): void
    {
        if (isset($validated['personal_detail'])) {
            $personalDetailData = $validated['personal_detail'];

            if (! empty($personalDetailData['date_of_birth'])) {
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
            $profileData = array_filter($validated['profile'], fn ($value): bool => ! empty($value));

            if ($profileData !== []) {
                $user->profile()->updateOrCreate(
                    ['user_id' => $user->id],
                    $profileData
                );
            }
        }
    }

    private function updateSkills(User $user, array $validated): void
    {
        if (! empty($validated['skills'])) {
            $user->skills()->sync(array_map('intval', $validated['skills']));
        }
    }

    private function updateWorkPermits(User $user, array $validated): void
    {
        if (! empty($validated['work_permits'])) {
            $user->workPermits()->delete();

            $workPermits = array_map(
                fn ($country): array => ['country' => $country],
                array_filter($validated['work_permits'], fn ($country): bool => ! empty($country))
            );

            $user->workPermits()->createMany($workPermits);
        }
    }

    private function updateWorkExperiences(User $user, array $validated): void
    {
        if (! empty($validated['work_experiences'])) {
            $user->workExperiences()->delete();

            $workExperiences = array_map(function (array $experience): array {
                $endDate = (! empty($experience['end_date']) && ! ($experience['is_current'] ?? false))
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
        if (! empty($validated['educations'])) {
            $user->educations()->delete();

            $educations = array_map(function (array $education): array {
                $endDate = (! empty($education['end_date']) && ! ($education['is_current'] ?? false))
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
        if (! empty($validated['certificates'])) {
            $user->certificates()->delete();

            $certificates = array_map(
                fn (array $certificate): array => [
                    'name' => $certificate['name'],
                    'number' => $certificate['number'],
                ],
                array_filter($validated['certificates'], fn (array $certificate): bool => ! empty($certificate['name']))
            );

            $user->certificates()->createMany($certificates);
        }
    }

    private function updateUserLanguages(User $user, array $validated): void
    {
        if (! empty($validated['user_languages'])) {
            $user->userLanguages()->delete();

            $userLanguages = array_map(fn (array $language): array => [
                'language_id' => (int) $language['language_id'],
                'proficiency' => $language['proficiency'],
                'can_read' => $language['can_read'] ?? false,
                'can_write' => $language['can_write'] ?? false,
                'can_speak' => $language['can_speak'] ?? false,
            ], $validated['user_languages']);

            $user->userLanguages()->createMany($userLanguages);
        }
    }
}
