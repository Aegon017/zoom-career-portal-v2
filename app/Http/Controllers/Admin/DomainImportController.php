<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Imports\DomainImport;
use Exception;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;

class DomainImportController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        try {
            Excel::import(new DomainImport, $request->file('file'));
        } catch (Exception $exception) {
            return back()->with('error', 'Failed to import - ' . $exception->getMessage());
        }

        return back()->with('success', 'Domains imported successfully');
    }
}
