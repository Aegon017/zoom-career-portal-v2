<?php

declare(strict_types=1);

namespace App\Http\Controllers\Jobseeker;

use App\Enums\VerificationStatusEnum;
use App\Http\Controllers\Controller;
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
        $user = $user->load('followers', 'followingUsers', 'followingCompanies', 'skills', 'workExperiences', 'workExperiences.company');
        $jobseeker_profile = $user->jobseekerProfile;
        $skills = Skill::get();
        $companies = Company::where('verification_status', VerificationStatusEnum::Verified->value)->orderBy('name')->get();

        return Inertia::render('jobseeker/profile', [
            'user' => $user,
            'skills' => $skills,
            'jobseeker_profile' => $jobseeker_profile,
            'companies' => $companies,
        ]);
    }

    public function storeBasicDetails(Request $request)
    {
        $user = Auth::user();

        $data = $request->validate([
            'name' => 'nullable|string|max:255',
            'email' => ['required', 'email', 'max:255', 'unique:users,email,'.$user->id],
            'phone' => ['nullable', 'string', 'max:20', 'unique:users,phone,'.$user->id],
            'location' => 'nullable|string|max:255',
            'experience' => 'nullable|string|max:255',
            'notice_period' => 'nullable|string|max:255',
            'profile_image' => 'nullable|string|max:255',
        ]);

        $user->update([
            'name' => $data['name'],
            'email' => $data['email'],
            'phone' => $data['phone'],
            'location' => $data['location'],
        ]);

        if (! empty($data['profile_image']) && Storage::disk('public')->exists($data['profile_image'])) {
            $user->addMedia(storage_path('app/public/'.$data['profile_image']))
                ->preservingOriginal()
                ->toMediaCollection('profile_images');
        }

        $user->jobseekerProfile()->update([
            'experience' => $data['experience'],
            'notice_period' => $data['notice_period'],
        ]);

        return back()->with('success', 'succesfully updated basic details');
    }

    public function storeSummary(Request $request)
    {

        $data = $request->validate([
            'summary' => 'required|string',
        ]);

        $user = Auth::user();

        $user->jobseekerProfile()->update([
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
}
