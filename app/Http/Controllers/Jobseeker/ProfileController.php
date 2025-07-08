<?php

declare(strict_types=1);

namespace App\Http\Controllers\Jobseeker;

use App\Enums\ProficiencyEnum;
use App\Enums\VerificationStatusEnum;
use App\Http\Controllers\Controller;
use App\Http\Requests\CreateWorkExperienceRequest;
use App\Models\Certificate;
use App\Models\Company;
use App\Models\Education;
use App\Models\Language;
use App\Models\Skill;
use App\Models\User;
use App\Models\UserLanguage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rules\Enum;
use Inertia\Inertia;

final class ProfileController extends Controller
{
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

        if (! empty($data['avatar']) && Storage::disk('public')->exists($data['avatar'])) {
            $user->addMedia(storage_path('app/public/' . $data['avatar']))
                ->preservingOriginal()
                ->toMediaCollection('avatars');
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

        DB::transaction(function () use ($user, $validated) {
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
