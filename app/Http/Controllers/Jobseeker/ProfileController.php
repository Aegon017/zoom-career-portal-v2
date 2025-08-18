<?php

declare(strict_types=1);

namespace App\Http\Controllers\Jobseeker;

use App\Enums\ProficiencyEnum;
use App\Http\Controllers\Controller;
use App\Models\Certificate;
use App\Models\Education;
use App\Models\Language;
use App\Models\Location;
use App\Models\Skill;
use App\Models\User;
use App\Models\UserLanguage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rules\Enum;
use Inertia\Inertia;

final class ProfileController extends Controller
{
    public function wizard()
    {
        $user = Auth::user();

        $locations = Location::take(100)->get()->map(function ($location) {
            return [
                'value' => (string) $location->id,
                'label' => $location->full_name,
            ];
        });

        $skillOptions = Skill::get()->map(function ($skill) {
            return [
                'value' => (string) $skill->id,
                'label' => $skill->name,
            ];
        });

        $languages = Language::get()->map(function ($language) {
            return [
                'value' => (string) $language->id,
                'label' => $language->name,
            ];
        });

        // Prepare existing data for form
        $profileData = [
            'name' => $user->name,
            'email' => $user->email,
            'phone' => $user->phone,
            'avatar_url' => $user->avatar_url,
            'address' => $user->address ? ['location_id' => (string)$user->address->location_id] : null,
            'personal_detail' => $user->personalDetail ?: null,
            'profile' => $user->profile ?: null,
            'skills' => $user->skills->pluck('id')->map(fn($id) => (string)$id)->toArray(),
            'work_permits' => $user->workPermits->pluck('country')->toArray(),
            'work_experiences' => $user->workExperiences->map(function ($we) {
                return [
                    'title' => $we->title,
                    'company_name' => $we->company_name,
                    'start_date' => $we->start_date,
                    'end_date' => $we->end_date,
                    'is_current' => $we->is_current,
                ];
            })->toArray(),
            'educations' => $user->educations->map(function ($edu) {
                return [
                    'course_title' => $edu->course_title,
                    'institution' => $edu->institution,
                    'start_date' => $edu->start_date,
                    'end_date' => $edu->end_date,
                    'is_current' => $edu->is_current,
                    'course_type' => $edu->course_type,
                ];
            })->toArray(),
            'certificates' => $user->certificates->map(function ($cert) {
                return ['name' => $cert->name];
            })->toArray(),
            'user_languages' => $user->userLanguages->map(function ($ul) {
                return [
                    'language_id' => (string)$ul->language_id,
                    'proficiency' => $ul->proficiency,
                    'can_read' => $ul->can_read,
                    'can_write' => $ul->can_write,
                    'can_speak' => $ul->can_speak,
                ];
            })->toArray(),
        ];

        return Inertia::render('jobseeker/profile-wizard', [
            'user' => Auth::user(),
            'profileData' => $profileData,
            'locations' => $locations,
            'skillOptions' => $skillOptions,
            'languages' => $languages,
        ]);
    }

    public function complete(Request $request)
    {
        $user = User::find(Auth::id());

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email,' . $user->id,
            'phone' => 'required|string|max:20',
            'password' => 'required|string|min:8',
            'avatar_url' => 'required|string|max:500',

            'address' => 'required|array',
            'address.location_id' => 'required|string|exists:locations,id',

            'personal_detail' => 'required|array',
            'personal_detail.gender' => 'required|string|in:Male,Female,Other',
            'personal_detail.date_of_birth' => 'required|date|before:today',
            'personal_detail.marital_status' => 'required|string|in:Single/unmarried,Married',
            'personal_detail.differently_abled' => 'required|boolean',

            'profile' => 'required|array',
            'profile.job_title' => 'required|string|max:255',
            'profile.experience' => 'required|string|max:255',
            'profile.notice_period' => 'required|string|max:255',

            'skills' => 'required|array|min:1',
            'skills.*' => 'required|string|exists:skills,id',

            'work_permits' => 'required|array|min:1',
            'work_permits.*' => 'required|string|max:255',

            'work_experiences' => 'required|array|min:1',
            'work_experiences.*.title' => 'required|string|max:255',
            'work_experiences.*.company_name' => 'required|string|max:255',
            'work_experiences.*.start_date' => 'required|date',
            'work_experiences.*.end_date' => 'nullable|date|after_or_equal:work_experiences.*.start_date',
            'work_experiences.*.is_current' => 'required|boolean',

            'educations' => 'required|array|min:1',
            'educations.*.course_title' => 'required|string|max:255',
            'educations.*.institution' => 'required|string|max:255',
            'educations.*.start_date' => 'required|date',
            'educations.*.end_date' => 'nullable|date|after_or_equal:educations.*.start_date',
            'educations.*.is_current' => 'required|boolean',
            'educations.*.course_type' => 'required|string|in:Full-time,Part-time,Online',

            'certificates' => 'required|array|min:1',
            'certificates.*.name' => 'required|string|max:255',

            'user_languages' => 'required|array|min:1',
            'user_languages.*.language_id' => 'required|string|exists:languages,id',
            'user_languages.*.proficiency' => 'required|string|in:basic,intermediate,advanced,fluent,native',
            'user_languages.*.can_read' => 'required|boolean',
            'user_languages.*.can_write' => 'required|boolean',
            'user_languages.*.can_speak' => 'required|boolean',
        ]);

        try {
            DB::transaction(function () use ($validated, $user) {
                // Update user
                $userData = [
                    'name' => $validated['name'],
                    'email' => $validated['email'],
                    'phone' => $validated['phone'],
                    'avatar_url' => $validated['avatar_url'],
                    'password' => Hash::make($validated['password']),
                ];

                $user->update($userData);

                // Address
                $user->address()->updateOrCreate(
                    ['user_id' => $user->id],
                    ['location_id' => (int)$validated['address']['location_id']]
                );

                // Personal Detail
                $pdData = $validated['personal_detail'];
                $pdData['date_of_birth'] = date('Y-m-d', strtotime($pdData['date_of_birth']));

                $user->personalDetail()->updateOrCreate(
                    ['user_id' => $user->id],
                    $pdData
                );

                // Profile
                $user->profile()->updateOrCreate(
                    ['user_id' => $user->id],
                    $validated['profile']
                );

                // Skills (sync)
                $skillIds = array_map('intval', $validated['skills']);
                $user->skills()->sync($skillIds);

                // Work Permits (delete and recreate)
                $user->workPermits()->delete();
                foreach ($validated['work_permits'] as $country) {
                    $user->workPermits()->create(['country' => $country]);
                }

                // Work Experiences (delete and recreate)
                $user->workExperiences()->delete();
                foreach ($validated['work_experiences'] as $exp) {
                    $user->workExperiences()->create([
                        'title' => $exp['title'],
                        'company_name' => $exp['company_name'],
                        'start_date' => date('Y-m-d', strtotime($exp['start_date'])),
                        'end_date' => $exp['end_date'] ? date('Y-m-d', strtotime($exp['end_date'])) : null,
                        'is_current' => $exp['is_current'],
                    ]);
                }

                // Education (delete and recreate)
                $user->educations()->delete();
                foreach ($validated['educations'] as $edu) {
                    $user->educations()->create([
                        'course_title' => $edu['course_title'],
                        'institution' => $edu['institution'],
                        'start_date' => date('Y-m-d', strtotime($edu['start_date'])),
                        'end_date' => $edu['end_date'] ? date('Y-m-d', strtotime($edu['end_date'])) : null,
                        'is_current' => $edu['is_current'],
                        'course_type' => $edu['course_type'],
                    ]);
                }

                // Certificates (delete and recreate)
                $user->certificates()->delete();
                foreach ($validated['certificates'] as $cert) {
                    $user->certificates()->create(['name' => $cert['name']]);
                }

                // Languages (delete and recreate)
                $user->userLanguages()->delete();
                foreach ($validated['user_languages'] as $lang) {
                    $user->userLanguages()->create([
                        'language_id' => (int)$lang['language_id'],
                        'proficiency' => $lang['proficiency'],
                        'can_read' => $lang['can_read'],
                        'can_write' => $lang['can_write'],
                        'can_speak' => $lang['can_speak'],
                    ]);
                }
            });

            return to_route('jobseeker.dashboard')->with('success', 'Profile completed successfully!');
        } catch (\Exception $e) {
            Log::error('Profile completion error: ' . $e->getMessage());
            return back()->withErrors(['error' => 'Failed to save profile. Please try again.']);
        }
    }

    public function show(User $user)
    {
        $user = $user->load('followers', 'followingUsers', 'followingCompanies', 'skills', 'workExperiences', 'workExperiences.company', 'profile', 'address', 'address.location', 'workPermits', 'personalDetail', 'userLanguages', 'userLanguages.language', 'certificates', 'educations');

        return Inertia::render('jobseeker/profile', [
            'user' => $user,
        ]);
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
            'languages.*.proficiency' => ['required', new Enum(ProficiencyEnum::class)],
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
}
