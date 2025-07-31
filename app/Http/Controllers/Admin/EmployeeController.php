<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

final class EmployeeController extends Controller
{
    public function index(Request $request)
    {
        $employees = User::query()->Role('employer')
            ->when(
                $request->search,
                fn($q) => $q->where('name', 'like', '%' . $request->search . '%')
                    ->orWhere('email', 'like', '%' . $request->search . '%')
            )
            ->paginate($request->perPage ?? 10)
            ->withQueryString();

        return Inertia::render('admin/employee/employees-listing', [
            'employees' => $employees,
            'filters' => $request->only('search', 'perPage'),
        ]);
    }

    public function create(Request $request)
    {
        return Inertia::render('admin/employee/create-or-edit-employee');
    }

    public function show(int $id)
    {
        $user = User::find($id);

        return Inertia::render('admin/employee/view-employee', [
            'user' => $user->load('profile'),
            'company' => $user->companies()->latest()->first(),
        ]);
    }

    public function edit(Request $request, User $employee)
    {
        return Inertia::render('admin/employee/create-or-edit-employee', [
            'employee' => $employee->load(['profile'])
        ]);
    }

    public function destroy(User $employee)
    {
        try {
            DB::transaction(function () use ($employee) {
                $employee->profile()->delete();
                $employee->removeRole('employer');
                $employee->delete();
            });

            return to_route('admin.employees.index')->with('success', 'Employee deleted successfully.');
        } catch (\Exception $e) {
            Log::error('Failed to delete employee: ' . $e->getMessage());
            return back()->withErrors(['error' => 'Failed to delete employee. Please try again.']);
        }
    }
}
