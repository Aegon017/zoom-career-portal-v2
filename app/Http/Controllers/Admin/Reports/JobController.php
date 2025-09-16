<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin\Reports;

use App\Http\Controllers\Controller;
use App\Models\Opening;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

final class JobController extends Controller
{
    public function index(Request $request): Response
    {
        $openings = Opening::query()
            ->with(['applications.user', 'company'])
            ->withCount([
                'applications as total_applied',
                'applications as total_shortlisted' => fn($q) => $q->where('status', 'shortlisted'),
                'applications as total_hired' => fn($q) => $q->where('status', 'hired'),
            ])
            ->paginate($request->input('perPage', 10))
            ->withQueryString();

        return Inertia::render('admin/reports/jobs-report', [
            'data' => $openings,
            'filters' => $request->only(['search', 'perPage']),
        ]);
    }
}
