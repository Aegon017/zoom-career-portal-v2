<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;

final class AdminEmployeeController extends Controller
{
    public function index()
    {
        dd();
    }

    public function show(string $id)
    {
        $user = User::find($id);

        return Inertia::render('admin/employers/show');
    }
}
