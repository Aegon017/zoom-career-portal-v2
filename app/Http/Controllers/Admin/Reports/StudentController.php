<?php

namespace App\Http\Controllers\Admin\Reports;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class StudentController extends Controller
{
    public function index(Request $request): Response
    {
        $students = User::query()
            ->role('jobseeker')
            ->withCount([
                'openingApplications as total_applied',
                'openingApplications as total_shortlisted' => fn($q) => $q->where('status', 'shortlisted'),
                'openingApplications as total_hired' => fn($q) => $q->where('status', 'hired'),
            ])
            ->when(
                $request->search,
                fn($q) => $q->where('name', 'like', '%' . $request->search . '%')
                    ->orWhere('email', 'like', '%' . $request->search . '%')
            )
            ->paginate($request->perPage ?? 10)
            ->withQueryString();

        return Inertia::render('admin/reports/students-report', [
            'data' => $students,
            'filters' => $request->only('search', 'perPage'),
        ]);
    }
}
