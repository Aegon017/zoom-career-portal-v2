<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Inertia\Inertia;
use Inertia\Response;

final class EmployerDasboardController extends Model
{
    public function index(): Response
    {
        return Inertia::render('employer/dashboard');
    }
}
