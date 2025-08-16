<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Imports\IndustriesImport;
use Exception;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;

class IndustriesImportController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        try {
            Excel::import(new IndustriesImport, $request->file('file'));
        } catch (Exception $e) {
            return back()->with('error', 'Failed to import - ' . $e->getMessage());
        }

        return back()->with('success', 'Industries imported successfully');
    }
}
