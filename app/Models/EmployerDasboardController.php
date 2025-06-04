<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Inertia\Inertia;
use Inertia\Response;

class EmployerDasboardController extends Model
{
    public function index(): Response
    {
        return Inertia::render('employer/dashboard');
    }
}
