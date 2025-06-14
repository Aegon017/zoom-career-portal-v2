<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateWorkExperienceRequest;
use App\Http\Resources\WorkExperienceResource;
use App\Models\Company;
use App\Models\WorkExperience;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class EmployerManageProfileController extends Controller
{
    public function index(): Response
    {
        $user = Auth::user();

        $work_experiences = WorkExperienceResource::collection(
            $user->workExperiences()
                ->with(['company.media', 'media'])
                ->get()
        );

        $companies = Company::query()->orderBy('company_name')->get();

        return Inertia::render('employer/manage-profile/index', [
            'work_experiences' => $work_experiences,
            'companies' => $companies
        ]);
    }

    public function storeExperience(CreateWorkExperienceRequest $request)
    {
        $data = $request->validated();

        $user = Auth::user();

        $work_experience = $user->workExperiences()->create($data);

        if (! empty($data['company_logo']) && Storage::disk('public')->exists($data['company_logo'])) {
            $work_experience->addMedia(storage_path('app/public/' . $data['company_logo']))
                ->preservingOriginal()
                ->toMediaCollection('company_logo');
        }

        return redirect()->back()->with('success', 'Work experience added successfully.');
    }
}
