<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Enums\OperationsEnum;
use App\Exports\StudentsExport;
use App\Models\Language;
use App\Models\Location;
use App\Models\Skill;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Maatwebsite\Excel\Facades\Excel;

final class StudentController extends Controller
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
        return Inertia::render('admin/students/create-or-edit-student');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): void
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(User $student): Response
    {
        $student->load(['skills', 'profile', 'resumes', 'workExperiences.company', 'educations', 'personalDetail', 'address.location', 'workPermits', 'userLanguages.language', 'certificates']);

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
        $locations = Location::take(100)->get()->map(function ($location) {
            return [
                'value' => $location->id,
                'label' => $location->full_name,
            ];
        });
        $skillOptions = Skill::get()->map(function ($skill) {
            return [
                'value' => $skill->id,
                'label' => $skill->name,
            ];
        });
        $languages = Language::get()->map(function ($language) {
            return [
                'value' => $language->id,
                'label' => $language->name,
            ];
        });
        $operation = OperationsEnum::Edit;

        return Inertia::render('admin/students/create-or-edit-student', [
            'student' => $student,
            'operation' => $operation,
            'skillOptions' => $skillOptions,
            'operationLabel' => $operation->label(),
            'locations' => $locations,
            'languages' => $languages,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $student): void
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $student): RedirectResponse
    {
        $student->delete();

        return to_route('admin.students.index')->with('success', 'Student deleted successfully.');
    }

    public function export()
    {
        return Excel::download(new StudentsExport, 'students.xlsx');
    }
}
