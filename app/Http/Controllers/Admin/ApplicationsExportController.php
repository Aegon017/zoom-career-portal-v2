<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Exports\ApplicationsExport;
use App\Http\Controllers\Controller;
use App\Models\Opening;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;

final class ApplicationsExportController extends Controller
{
    public function __invoke(Request $request)
    {
        $request->validate([
            'job_id' => 'required|exists:openings,id',
            'status' => 'sometimes|string'
        ]);

        $job = Opening::findOrFail($request->query('job_id'));

        return Excel::download(
            new ApplicationsExport($job, $request->query('status')),
            "applications-{$job->id}.xlsx"
        );
    }
}