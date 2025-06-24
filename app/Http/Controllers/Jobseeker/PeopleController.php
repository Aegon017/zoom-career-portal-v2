<?php

declare(strict_types=1);

namespace App\Http\Controllers\Jobseeker;

use App\Http\Controllers\Controller;
use App\Models\User;
use Inertia\Inertia;

final class PeopleController extends Controller
{
    public function index()
    {
        $users = User::role('jobseeker')->get();

        return Inertia::render('jobseeker/people', [
            'users' => $users,
        ]);
    }
}
