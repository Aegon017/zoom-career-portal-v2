<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class JobSaveController extends Controller
{
    public function store(Request $request, string $jobId)
    {
        $request->user()->savedOpenings()->firstOrCreate([
            'opening_id' => $jobId,
        ]);

        return back()->with('success', 'Job saved.');
    }

    public function destroy(Request $request, string $jobId)
    {
        $request->user()->savedOpenings()->where('opening_id', $jobId)->delete();

        return back()->with('success', 'Job unsaved.');
    }
}
