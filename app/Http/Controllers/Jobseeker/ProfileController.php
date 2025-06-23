<?php

declare(strict_types=1);

namespace App\Http\Controllers\Jobseeker;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

final class ProfileController extends Controller
{
    public function index()
    {
        $user = Auth::user()->load('followers', 'followingUsers', 'followingCompanies');
        $jobseeker_profile = $user->jobseekerProfile;

        return Inertia::render('jobseeker/profile', [
            'user' => $user,
            'jobseeker_profile' => $jobseeker_profile,
        ]);
    }

    public function storeBasicDetails(Request $request)
    {
        $user = Auth::user();

        $data = $request->validate([
            'name' => 'nullable|string|max:255',
            'email' => ['required', 'email', 'max:255', 'unique:users,email,' . $user->id],
            'phone' => ['nullable', 'string', 'max:20', 'unique:users,phone,' . $user->id],
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
            $user->addMedia(storage_path('app/public/' . $data['profile_image']))
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
}
