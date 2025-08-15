<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Imports\SkillsImport;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Maatwebsite\Excel\Facades\Excel;

class SkillsImportController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        try {
            Excel::import(new SkillsImport, $request->file('file'));
        } catch (Exception $e) {
            return back()->with('error', 'Failed to import - ' . $e->getMessage());
        }

        return back()->with('success', 'Skills imported successfully');
    }
}
