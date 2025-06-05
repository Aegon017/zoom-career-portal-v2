<?php

namespace App\Http\Controllers\Jobseeker;

use App\Http\Controllers\Controller;
use App\Models\Opening;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class JobseekerDashboardController extends Controller
{
    public function index(): Response
    {
        $openings = Opening::query()->latest()->get();

        return Inertia::render('jobseeker/explore', [
            'openings' => $openings
        ]);
    }
}
