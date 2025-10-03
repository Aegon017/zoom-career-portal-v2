<?php

namespace App\Http\Controllers\Admin;

use App\Exports\StudentReportExport;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;

class StudentReportExportController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        $fieldsParam = $request->get('fields', '');

        $selectedFields = $fieldsParam ? explode(',', (string) $fieldsParam) : [];

        $selectedFields = array_filter($selectedFields);

        $filters = $request->only(['search', 'perPage']);

        return Excel::download(new StudentReportExport($selectedFields, $filters), 'students-report.xlsx');
    }
}
