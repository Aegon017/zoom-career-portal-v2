<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Enums\OperationsEnum;
use App\Enums\VerificationStatusEnum;
use App\Http\Controllers\Controller;
use App\Models\Company;
use App\Models\User;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Enum;
use Inertia\Inertia;

final class EmployeeController extends Controller
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

    public function create()
    {
        $operation = OperationsEnum::Create->option();

        $companyOptions = Company::pluck('name', 'id')->map(fn($name, $id): array => ['value' => $id, 'label' => $name])->values();

        return Inertia::render('admin/employee/create-or-edit-employee', [
            'operation' => $operation,
            'companyOptions' => $companyOptions,
            'verificationStatusOptions' => VerificationStatusEnum::options(),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'phone' => 'required|string|max:20',
            'job_title' => 'nullable|string|max:255',
            'company_id' => 'required|exists:companies,id',
            'password' => 'required|string|min:8',
            'verification_status' => ['required', new Enum(VerificationStatusEnum::class)],
        ]);

        return DB::transaction(function () use ($data) {
            $user = User::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'phone' => $data['phone'],
                'password' => Hash::make($data['password']),
            ]);

            $user->assignRole('employer');

            $user->profile()->create([
                'job_title' => $data['job_title'] ?? null,
            ]);

            $user->companies()->attach([
                $data['company_id'] => [
                    'role' => 'recruiter',
                    'verification_status' => $data['verification_status']->value,
                ],
            ]);

            return to_route('admin.employees.index')->with('success', 'Employee created successfully');
        });
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
        $operation = OperationsEnum::Edit->option();

        $companyOptions = Company::get()->map(fn($company): array => [
            'value' => $company->id,
            'label' => $company->name,
        ]);

        return Inertia::render('admin/employee/create-or-edit-employee', [
            'employee' => $employee->load(['profile', 'companyUsers']),
            'operation' => $operation,
            'companyOptions' => $companyOptions,
            'verificationStatusOptions' => VerificationStatusEnum::options(),
        ]);
    }

    public function update(Request $request, User $employee)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,'.$employee->id,
            'phone' => 'required|string|max:20',
            'job_title' => 'nullable|string|max:255',
            'company_id' => 'required|exists:companies,id',
            'verification_status' => ['required', Rule::in(VerificationStatusEnum::values())],
            'password' => 'nullable|string|min:8',
        ]);

        return DB::transaction(function () use ($employee, $data) {
            $employee->update([
                'name' => $data['name'],
                'email' => $data['email'],
                'phone' => $data['phone'],
                'password' => empty($data['password']) ? $employee->password : Hash::make($data['password']),
            ]);

            $employee->profile()->updateOrCreate([], [
                'job_title' => $data['job_title'] ?? null,
            ]);

            $employee->companies()->sync([
                $data['company_id'] => [
                    'role' => 'recruiter',
                    'verification_status' => VerificationStatusEnum::from($data['verification_status'])->value,
                ],
            ]);

            return redirect()->route('admin.employees.index')->with('success', 'Employee updated successfully');
        });
    }

    public function destroy(User $employee)
    {
        try {
            DB::transaction(function () use ($employee): void {
                $employee->profile()->delete();
                $employee->removeRole('employer');
                $employee->delete();
            });

            return to_route('admin.employees.index')->with('success', 'Employee deleted successfully.');
        } catch (Exception $exception) {
            Log::error('Failed to delete employee: '.$exception->getMessage());

            return back()->withErrors(['error' => 'Failed to delete employee. Please try again.']);
        }
    }
}
