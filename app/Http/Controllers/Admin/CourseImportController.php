<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Imports\CoursesImport;
use Exception;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;

final class CourseImportController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        try {
            Excel::import(new CoursesImport, $request->file('file'));
        } catch (Exception $exception) {
            return back()->with('error', 'Failed to import - '.$exception->getMessage());
        }

        return back()->with('success', 'Industries imported successfully');
    }
}
