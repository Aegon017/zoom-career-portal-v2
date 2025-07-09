<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

final class AdminEmployeeController extends Controller
{
    public function index(Request $request)
    {
        $employees = User::query()->Role('employer')
            ->when(
                $request->search,
                fn ($q) => $q->where('name', 'like', '%'.$request->search.'%')
                    ->orWhere('email', 'like', '%'.$request->search.'%')
            )
            ->paginate($request->perPage ?? 10)
            ->withQueryString();

        return Inertia::render('admin/employee/employees-listing', [
            'employees' => $employees,
            'filters' => $request->only('search', 'perPage'),
        ]);
    }

    public function show(int $id)
    {
        $user = User::find($id);

        return Inertia::render('admin/employee/view-employee', [
            'user' => $user->load('profile'),
            'company' => $user->companies()->latest()->first(),
        ]);
    }
}
