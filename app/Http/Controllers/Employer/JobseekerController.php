<?php

declare(strict_types=1);

namespace App\Http\Controllers\Employer;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

final class JobseekerController extends Controller
{
    public function index(Request $request): Response
    {
        $query = User::query()->role('jobseeker');

        if ($request->filled('search')) {
            $query->where('name', 'like', '%'.$request->search.'%');
        }

        if ($request->filled('skill') && $request->skill !== 'all') {
            $query->whereHas('skills', function ($q) use ($request): void {
                $q->where('name', $request->skill);
            });
        }

        $initialUsers = $query->with('skills')->paginate(10)->withQueryString();

        return Inertia::render('employer/jobseekers-listing', [
            'initialUsers' => $initialUsers,
        ]);
    }
}
