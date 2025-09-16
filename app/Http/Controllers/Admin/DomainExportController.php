<?php

namespace App\Http\Controllers\Admin;

use App\Exports\DomainExport;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;

class DomainExportController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        $fieldsParam = $request->get('fields', '');

        $selectedFields = $fieldsParam ? explode(',', (string) $fieldsParam) : [];

        $selectedFields = array_filter($selectedFields);

        return Excel::download(new DomainExport($selectedFields), 'domains.xlsx');
    }
}
