<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\CreateWorkExperienceRequest;
use App\Http\Resources\WorkExperienceResource;
use App\Models\Company;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

final class EmployerManageProfileController extends Controller
{
    public function index(): Response
    {
        $user = Auth::user();

        $work_experiences = WorkExperienceResource::collection(
            $user->workExperiences()
                ->with(['company.media', 'media'])
                ->get()
        );

        $companies = Company::query()->orderBy('name')->get();

        return Inertia::render('employer/manage-profile/index', [
            'work_experiences' => $work_experiences,
            'companies' => $companies,
            'user' => $user,
        ]);
    }

    public function updateProfile(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'headline' => 'nullable|string|max:255',
            'pronouns' => 'nullable|string|max:50',
            'location' => 'nullable|string|max:255',
            'profile_image' => 'nullable|string|max:255',
        ]);

        $user = Auth::user();
        $user->update($validated);

        if (! empty($validated['profile_image']) && Storage::exists($validated['profile_image'])) {
            $user->addMedia(storage_path('app/public/'.$validated['profile_image']))
                ->preservingOriginal()
                ->toMediaCollection('profile_images');
        }

        return back()->with('success', 'Profile updated.');
    }

    public function storeExperience(CreateWorkExperienceRequest $request)
    {
        $data = $request->validated();

        $user = Auth::user();

        $work_experience = $user->workExperiences()->create($data);

        if (! empty($data['company_logo']) && Storage::exists($data['company_logo'])) {
            $work_experience->addMedia(storage_path('app/public/'.$data['company_logo']))
                ->preservingOriginal()
                ->toMediaCollection('company_logos');
        }

        return redirect()->back()->with('success', 'Work experience added successfully.');
    }

    public function updateBanner(Request $request)
    {
        $request->validate([
            'banner' => ['required', 'string'],
        ]);

        $user = Auth::user();

        $user->update([
            'banner' => $request->banner,
        ]);

        return back()->with('success', 'Banner theme updated successfully.');
    }
}
