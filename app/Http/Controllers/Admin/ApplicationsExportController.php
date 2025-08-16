<?php

namespace App\Http\Controllers\Admin;

use App\Exports\ApplicationsExport;
use App\Http\Controllers\Controller;
use App\Models\Opening;
use Maatwebsite\Excel\Facades\Excel;

class ApplicationsExportController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Opening $job)
    {
        return Excel::download(
            new ApplicationsExport($job),
            "applications-{$job->id}.xlsx"
        );
    }
}
