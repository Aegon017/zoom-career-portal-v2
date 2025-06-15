<?php

declare(strict_types=1);

namespace App\Http\Controllers\Employer;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

final class EmployerDashboardController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('employer/dashboard');
    }
}
