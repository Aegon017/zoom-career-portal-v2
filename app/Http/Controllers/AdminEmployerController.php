<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;

final class AdminEmployerController extends Controller
{
    public function index(): never
    {
        dd();
    }

    public function show(string $id)
    {
        User::find($id);

        return Inertia::render('admin/employers/show');
    }
}
