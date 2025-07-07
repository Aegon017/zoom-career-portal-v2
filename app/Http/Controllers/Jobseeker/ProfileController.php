<?php

declare(strict_types=1);

namespace App\Http\Controllers\Jobseeker;

use App\Enums\VerificationStatusEnum;
use App\Http\Controllers\Controller;
use App\Http\Requests\CreateWorkExperienceRequest;
use App\Models\Company;
use App\Models\Skill;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

final class ProfileController extends Controller
{
    public function show(User $user)
    {
        $user = $user->load('followers', 'followingUsers', 'followingCompanies', 'skills', 'workExperiences', 'workExperiences.company', 'profile', 'address', 'address.location');

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
            'avatar' => ['nullable', 'url'],
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

    public function storeExperience(CreateWorkExperienceRequest $request)
    {
        $data = $request->validated();

        $user = Auth::user();

        $work_experience = $user->workExperiences()->updateOrCreate($data);

        if (! empty($data['logo']) && Storage::disk('public')->exists($data['logo'])) {
            $work_experience->addMedia(storage_path('app/public/' . $data['logo']))
                ->preservingOriginal()
                ->toMediaCollection('logos');
        }

        return redirect()->back()->with('success', 'Work experience added successfully.');
    }
}
