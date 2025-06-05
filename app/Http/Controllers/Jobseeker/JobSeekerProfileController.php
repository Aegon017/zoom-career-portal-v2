<?php

declare(strict_types=1);

namespace App\Http\Controllers\Jobseeker;

use App\Http\Controllers\Controller;
use App\Models\JobseekerProfile;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

final class JobseekerProfileController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        return Inertia::render('jobseeker/profile');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(JobseekerProfile $jobseekerProfile)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(JobseekerProfile $jobseekerProfile)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, JobseekerProfile $jobseekerProfile)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(JobseekerProfile $jobseekerProfile)
    {
        //
    }
}
