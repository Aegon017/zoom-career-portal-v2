<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Exports\SkillExport;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;

final class SkillExportController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        $fieldsParam = $request->get('fields', '');

        $selectedFields = $fieldsParam ? explode(',', (string) $fieldsParam) : [];

        $selectedFields = array_filter($selectedFields);

        return Excel::download(new SkillExport($selectedFields), 'skills.xlsx');
    }
}
