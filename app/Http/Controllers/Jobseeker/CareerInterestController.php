<?php

namespace App\Http\Controllers\Jobseeker;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CareerInterestController extends Controller
{
    public function index()
    {
        $careerInterest = Auth::user()->careerInterest;
        return Inertia::render('jobseeker/career-interests', [
            'careerInterest' => $careerInterest
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'preferred_positions' => 'nullable|array',
            'post_graduation_plans' => 'nullable|array',
            'zoom_support_preferences' => 'nullable|array',
            'desired_jobs' => 'nullable|array',
            'preferred_locations' => 'nullable|array',
            'target_industries' => 'nullable|array',
            'job_function_interests' => 'nullable|array',
            'graduation_month' => 'nullable|string',
            'graduation_year' => 'nullable|string',
        ]);

        $user = User::find(Auth::id());

        if ($user->careerInterest) {
            $user->careerInterest->update($validated);
        } else {
            $user->careerInterest()->create($validated);
        }

        return redirect()->back()->with('success', 'Career interest saved successfully!');
    }
}
