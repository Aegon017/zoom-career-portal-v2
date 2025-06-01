<?php

namespace App\Http\Controllers;

use App\Models\JobPosting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SavedJobPostingController extends Controller
{
    public function save(JobPosting $jobPosting)
    {
        $jobseeker = Auth::user()->jobseeker;

        $jobseeker->savedJobPostings()->syncWithoutDetaching([$jobPosting->id]);

        return back()->with('success', 'Job saved successfully.');
    }

    public function unsave(JobPosting $jobPosting)
    {
        $jobseeker = Auth::user()->jobseeker;

        $jobseeker->savedJobPostings()->detach($jobPosting->id);

        return back()->with('success', 'Job unsaved successfully.');
    }
}
