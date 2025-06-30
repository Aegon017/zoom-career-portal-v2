<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;

final class AdminEmployeeController extends Controller
{
    public function index()
    {
        $employees = User::whereHas('companies')->get();

        return Inertia::render('admin/employee/employees-listing', [
            'employees' => $employees,
        ]);
    }

    public function show(int $id)
    {
        $user = User::find($id);

        return Inertia::render('admin/employee/view-employee', [
            'user' => $user,
        ]);
    }
}
