<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Location;
use App\Models\Skill;
use App\Models\Language;
use App\Enums\OperationsEnum;
use App\Exports\StudentsExport;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;
use Maatwebsite\Excel\Facades\Excel;

class StudentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $students = User::query()
            ->role('jobseeker')
            ->when(
                $request->search,
                fn($q) => $q->where('name', 'like', '%' . $request->search . '%')
            )
            ->paginate($request->perPage ?? 10)
            ->withQueryString();

        return Inertia::render('admin/students/students-listing', [
            'students' => $students,
            'filters' => $request->only('search', 'perPage'),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
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

        $operation = OperationsEnum::Create;

        return Inertia::render('admin/students/create-or-edit-student', [
            'student' => new User(),
            'operation' => $operation->value,
            'skillOptions' => $skillOptions,
            'operationLabel' => $operation->label(),
            'locations' => $locations,
            'languages' => $languages,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            // Basic user fields
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email',
            'phone' => 'nullable|string|max:20',
            'password' => 'required|string|min:8',
            'avatar_url' => 'nullable|string|max:500',

            // Address
            'address' => 'nullable|array',
            'address.location_id' => 'nullable|string|exists:locations,id',

            // Personal Details
            'personal_detail' => 'nullable|array',
            'personal_detail.gender' => 'required|string|in:Male,Female,Other',
            'personal_detail.date_of_birth' => 'nullable|date|before:today',
            'personal_detail.marital_status' => 'nullable|string|in:Single/unmarried,Married',
            'personal_detail.differently_abled' => 'boolean',

            // Profile
            'profile' => 'nullable|array',
            'profile.job_title' => 'nullable|string|max:255',
            'profile.experience' => 'nullable|string|max:255',
            'profile.notice_period' => 'nullable|string|max:255',
            'profile.summary' => 'nullable|string|max:2000',

            // Skills
            'skills' => 'nullable|array',
            'skills.*' => 'string|exists:skills,id',

            // Work Permits
            'work_permits' => 'nullable|array',
            'work_permits.*' => 'string|max:255',

            // Work Experiences
            'work_experiences' => 'nullable|array',
            'work_experiences.*.title' => 'required|string|max:255',
            'work_experiences.*.company_name' => 'nullable|string|max:255',
            'work_experiences.*.start_date' => 'required|date',
            'work_experiences.*.end_date' => 'nullable|date|after_or_equal:work_experiences.*.start_date',
            'work_experiences.*.is_current' => 'boolean',

            // Education
            'educations' => 'nullable|array',
            'educations.*.course_title' => 'required|string|max:255',
            'educations.*.institution' => 'required|string|max:255',
            'educations.*.start_date' => 'required|date',
            'educations.*.end_date' => 'nullable|date|after_or_equal:educations.*.start_date',
            'educations.*.is_current' => 'boolean',
            'educations.*.course_type' => 'nullable|string|in:Full-time,Part-time,Online',

            // Certificates
            'certificates' => 'nullable|array',
            'certificates.*.name' => 'required|string|max:255',

            // Languages
            'user_languages' => 'nullable|array',
            'user_languages.*.language_id' => 'required|string|exists:languages,id',
            'user_languages.*.proficiency' => 'required|string|in:basic,intermediate,advanced,native',
            'user_languages.*.can_read' => 'boolean',
            'user_languages.*.can_write' => 'boolean',
            'user_languages.*.can_speak' => 'boolean',
        ]);

        try {
            DB::transaction(function () use ($validated) {
                // Create user
                $user = User::create([
                    'name' => $validated['name'],
                    'email' => $validated['email'],
                    'phone' => $validated['phone'] ?? null,
                    'password' => Hash::make($validated['password']),
                    'avatar_url' => $validated['avatar_url'] ?? null,
                ]);

                // Assign jobseeker role
                $user->assignRole('jobseeker');

                // Create address
                if (isset($validated['address']['location_id']) && !empty($validated['address']['location_id'])) {
                    $user->address()->create([
                        'location_id' => (int) $validated['address']['location_id']
                    ]);
                }

                // Create personal details
                if (isset($validated['personal_detail'])) {
                    $personalDetailData = $validated['personal_detail'];

                    // Format date of birth
                    if (isset($personalDetailData['date_of_birth']) && !empty($personalDetailData['date_of_birth'])) {
                        $personalDetailData['date_of_birth'] = date('Y-m-d', strtotime($personalDetailData['date_of_birth']));
                    } else {
                        $personalDetailData['date_of_birth'] = null;
                    }

                    $user->personalDetail()->create([
                        'user_id' => $user->id,
                        'gender' => $personalDetailData['gender'],
                        'date_of_birth' => $personalDetailData['date_of_birth'],
                        'marital_status' => $personalDetailData['marital_status'] ?? null,
                        'differently_abled' => $personalDetailData['differently_abled'] ?? false,
                    ]);
                }

                // Create profile
                if (isset($validated['profile'])) {
                    $profileData = array_filter($validated['profile'], function ($value) {
                        return !is_null($value) && $value !== '';
                    });

                    if (!empty($profileData)) {
                        $user->profile()->create([
                            'user_id' => $user->id,
                            ...$profileData
                        ]);
                    }
                }

                // Attach skills
                if (isset($validated['skills']) && !empty($validated['skills'])) {
                    $skillIds = array_map('intval', $validated['skills']);
                    $user->skills()->attach($skillIds);
                }

                // Create work permits
                if (isset($validated['work_permits']) && !empty($validated['work_permits'])) {
                    foreach ($validated['work_permits'] as $country) {
                        if (!empty($country)) {
                            $user->workPermits()->create(['country' => $country]);
                        }
                    }
                }

                // Create work experiences
                if (isset($validated['work_experiences']) && !empty($validated['work_experiences'])) {
                    foreach ($validated['work_experiences'] as $experience) {
                        $endDate = null;
                        if (isset($experience['end_date']) && !empty($experience['end_date']) && !($experience['is_current'] ?? false)) {
                            $endDate = date('Y-m-d', strtotime($experience['end_date']));
                        }

                        $user->workExperiences()->create([
                            'title' => $experience['title'],
                            'company_name' => $experience['company_name'] ?? null,
                            'start_date' => date('Y-m-d', strtotime($experience['start_date'])),
                            'end_date' => $endDate,
                            'is_current' => $experience['is_current'] ?? false,
                        ]);
                    }
                }

                // Create education
                if (isset($validated['educations']) && !empty($validated['educations'])) {
                    foreach ($validated['educations'] as $education) {
                        $endDate = null;
                        if (isset($education['end_date']) && !empty($education['end_date']) && !($education['is_current'] ?? false)) {
                            $endDate = date('Y-m-d', strtotime($education['end_date']));
                        }

                        $user->educations()->create([
                            'course_title' => $education['course_title'],
                            'institution' => $education['institution'],
                            'start_date' => date('Y-m-d', strtotime($education['start_date'])),
                            'end_date' => $endDate,
                            'is_current' => $education['is_current'] ?? false,
                            'course_type' => $education['course_type'] ?? null,
                        ]);
                    }
                }

                // Create certificates
                if (isset($validated['certificates']) && !empty($validated['certificates'])) {
                    foreach ($validated['certificates'] as $certificate) {
                        if (!empty($certificate['name'])) {
                            $user->certificates()->create([
                                'name' => $certificate['name'],
                            ]);
                        }
                    }
                }

                // Create languages
                if (isset($validated['user_languages']) && !empty($validated['user_languages'])) {
                    foreach ($validated['user_languages'] as $language) {
                        $user->userLanguages()->create([
                            'language_id' => (int) $language['language_id'],
                            'proficiency' => $language['proficiency'],
                            'can_read' => $language['can_read'] ?? false,
                            'can_write' => $language['can_write'] ?? false,
                            'can_speak' => $language['can_speak'] ?? false,
                        ]);
                    }
                }
            });

            return to_route('admin.students.index')->with('success', 'Student created successfully.');
        } catch (\Exception $e) {
            Log::error('Failed to create student: ' . $e->getMessage());
            return back()->withErrors(['error' => 'Failed to create student. Please try again.'])->withInput();
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(User $student): Response
    {
        $student->load([
            'skills',
            'profile',
            'resumes',
            'workExperiences.company',
            'educations',
            'personalDetail',
            'address.location',
            'workPermits',
            'userLanguages.language',
            'certificates'
        ]);

        return Inertia::render('admin/students/student-profile', [
            'user' => $student,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $student): Response
    {
        $student->load([
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

        $operation = OperationsEnum::Edit;

        return Inertia::render('admin/students/create-or-edit-student', [
            'student' => $student,
            'operation' => $operation->value,
            'skillOptions' => $skillOptions,
            'operationLabel' => $operation->label(),
            'locations' => $locations,
            'languages' => $languages,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $student): RedirectResponse
    {
        $validated = $request->validate([
            // Basic user fields
            'name' => 'required|string|max:255',
            'email' => ['required', 'email', 'max:255', Rule::unique('users')->ignore($student->id)],
            'phone' => 'nullable|string|max:20',
            'password' => 'nullable|string|min:8',
            'avatar_url' => 'nullable|string|max:500',

            // Address
            'address' => 'nullable|array',
            'address.location_id' => 'nullable|string|exists:locations,id',

            // Personal Details
            'personal_detail' => 'nullable|array',
            'personal_detail.gender' => 'required|string|in:Male,Female,Other',
            'personal_detail.date_of_birth' => 'nullable|date|before:today',
            'personal_detail.marital_status' => 'nullable|string|in:Single/unmarried,Married',
            'personal_detail.differently_abled' => 'boolean',

            // Profile
            'profile' => 'nullable|array',
            'profile.job_title' => 'nullable|string|max:255',
            'profile.experience' => 'nullable|string|max:255',
            'profile.notice_period' => 'nullable|string|max:255',
            'profile.summary' => 'nullable|string|max:2000',

            // Skills
            'skills' => 'nullable|array',
            'skills.*' => 'string|exists:skills,id',

            // Work Permits
            'work_permits' => 'nullable|array',
            'work_permits.*' => 'string|max:255',

            // Work Experiences
            'work_experiences' => 'nullable|array',
            'work_experiences.*.title' => 'required|string|max:255',
            'work_experiences.*.company_name' => 'nullable|string|max:255',
            'work_experiences.*.start_date' => 'required|date',
            'work_experiences.*.end_date' => 'nullable|date|after_or_equal:work_experiences.*.start_date',
            'work_experiences.*.is_current' => 'boolean',

            // Education
            'educations' => 'nullable|array',
            'educations.*.course_title' => 'required|string|max:255',
            'educations.*.institution' => 'required|string|max:255',
            'educations.*.start_date' => 'required|date',
            'educations.*.end_date' => 'nullable|date|after_or_equal:educations.*.start_date',
            'educations.*.is_current' => 'boolean',
            'educations.*.course_type' => 'nullable|string|in:Full-time,Part-time,Online',

            // Certificates
            'certificates' => 'nullable|array',
            'certificates.*.name' => 'required|string|max:255',

            // Languages
            'user_languages' => 'nullable|array',
            'user_languages.*.language_id' => 'required|string|exists:languages,id',
            'user_languages.*.proficiency' => 'required|string|in:basic,intermediate,advanced,native',
            'user_languages.*.can_read' => 'boolean',
            'user_languages.*.can_write' => 'boolean',
            'user_languages.*.can_speak' => 'boolean',
        ]);

        try {
            DB::transaction(function () use ($validated, $student) {
                // Update user basic info
                $userData = [
                    'name' => $validated['name'],
                    'email' => $validated['email'],
                    'phone' => $validated['phone'] ?? null,
                    'avatar_url' => $validated['avatar_url'] ?? null,
                ];

                // Only update password if provided
                if (!empty($validated['password'])) {
                    $userData['password'] = Hash::make($validated['password']);
                }

                $student->update($userData);


                if (isset($validated['address']['location_id']) && !empty($validated['address']['location_id'])) {
                    $student->address()->updateOrCreate(
                        [],
                        ['location_id' => (int) $validated['address']['location_id']]
                    );
                } else {
                    $student->address()->delete();
                }

                // Update or create personal details
                if (isset($validated['personal_detail'])) {
                    $personalDetailData = $validated['personal_detail'];

                    // Format date of birth
                    if (isset($personalDetailData['date_of_birth']) && !empty($personalDetailData['date_of_birth'])) {
                        $personalDetailData['date_of_birth'] = date('Y-m-d', strtotime($personalDetailData['date_of_birth']));
                    } else {
                        $personalDetailData['date_of_birth'] = null;
                    }

                    $student->personalDetail()->updateOrCreate(
                        ['user_id' => $student->id],
                        [
                            'gender' => $personalDetailData['gender'],
                            'date_of_birth' => $personalDetailData['date_of_birth'],
                            'marital_status' => $personalDetailData['marital_status'] ?? null,
                            'differently_abled' => $personalDetailData['differently_abled'] ?? false,
                        ]
                    );
                }

                // Update or create profile
                if (isset($validated['profile'])) {
                    $profileData = array_filter($validated['profile'], function ($value) {
                        return !is_null($value) && $value !== '';
                    });

                    if (!empty($profileData)) {
                        $student->profile()->updateOrCreate(
                            ['user_id' => $student->id],
                            $profileData
                        );
                    } else {
                        $student->profile()->delete();
                    }
                }

                // Sync skills
                if (isset($validated['skills'])) {
                    $skillIds = array_map('intval', $validated['skills']);
                    $student->skills()->sync($skillIds);
                } else {
                    $student->skills()->detach();
                }

                // Update work permits
                $student->workPermits()->delete();
                if (isset($validated['work_permits']) && !empty($validated['work_permits'])) {
                    foreach ($validated['work_permits'] as $country) {
                        if (!empty($country)) {
                            $student->workPermits()->create(['country' => $country]);
                        }
                    }
                }

                // Update work experiences
                $student->workExperiences()->delete();
                if (isset($validated['work_experiences']) && !empty($validated['work_experiences'])) {
                    foreach ($validated['work_experiences'] as $experience) {
                        $endDate = null;
                        if (isset($experience['end_date']) && !empty($experience['end_date']) && !($experience['is_current'] ?? false)) {
                            $endDate = date('Y-m-d', strtotime($experience['end_date']));
                        }

                        $student->workExperiences()->create([
                            'title' => $experience['title'],
                            'company_name' => $experience['company_name'] ?? null,
                            'start_date' => date('Y-m-d', strtotime($experience['start_date'])),
                            'end_date' => $endDate,
                            'is_current' => $experience['is_current'] ?? false,
                        ]);
                    }
                }

                // Update education
                $student->educations()->delete();
                if (isset($validated['educations']) && !empty($validated['educations'])) {
                    foreach ($validated['educations'] as $education) {
                        $endDate = null;
                        if (isset($education['end_date']) && !empty($education['end_date']) && !($education['is_current'] ?? false)) {
                            $endDate = date('Y-m-d', strtotime($education['end_date']));
                        }

                        $student->educations()->create([
                            'course_title' => $education['course_title'],
                            'institution' => $education['institution'],
                            'start_date' => date('Y-m-d', strtotime($education['start_date'])),
                            'end_date' => $endDate,
                            'is_current' => $education['is_current'] ?? false,
                            'course_type' => $education['course_type'] ?? null,
                        ]);
                    }
                }

                // Update certificates
                $student->certificates()->delete();
                if (isset($validated['certificates']) && !empty($validated['certificates'])) {
                    foreach ($validated['certificates'] as $certificate) {
                        if (!empty($certificate['name'])) {
                            $student->certificates()->create([
                                'name' => $certificate['name'],
                            ]);
                        }
                    }
                }

                // Update languages
                $student->userLanguages()->delete();
                if (isset($validated['user_languages']) && !empty($validated['user_languages'])) {
                    foreach ($validated['user_languages'] as $language) {
                        $student->userLanguages()->create([
                            'language_id' => (int) $language['language_id'],
                            'proficiency' => $language['proficiency'],
                            'can_read' => $language['can_read'] ?? false,
                            'can_write' => $language['can_write'] ?? false,
                            'can_speak' => $language['can_speak'] ?? false,
                        ]);
                    }
                }
            });

            return to_route('admin.students.index')->with('success', 'Student updated successfully.');
        } catch (\Exception $e) {
            Log::error('Failed to update student: ' . $e->getMessage());
            return back()->withErrors(['error' => 'Failed to update student. Please try again.'])->withInput();
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $student): RedirectResponse
    {
        try {
            DB::transaction(function () use ($student) {
                // Delete related records first (if not using cascade delete)
                $student->address()->delete();
                $student->personalDetail()->delete();
                $student->profile()->delete();
                $student->workPermits()->delete();
                $student->workExperiences()->delete();
                $student->educations()->delete();
                $student->certificates()->delete();
                $student->userLanguages()->delete();

                // Detach many-to-many relationships
                $student->skills()->detach();

                // Remove roles
                $student->removeRole('jobseeker');

                // Finally delete the user
                $student->delete();
            });

            return to_route('admin.students.index')->with('success', 'Student deleted successfully.');
        } catch (\Exception $e) {
            Log::error('Failed to delete student: ' . $e->getMessage());
            return back()->withErrors(['error' => 'Failed to delete student. Please try again.']);
        }
    }

    public function export()
    {
        return Excel::download(new StudentsExport, 'students.xlsx');
    }
}
