<?php

namespace App\Http\Controllers\Jobseeker;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PeopleController extends Controller
{
    public function index()
    {
        $users = User::role('jobseeker')->get();

        return Inertia::render('jobseeker/people', [
            'users' => $users
        ]);
    }
}
