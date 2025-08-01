<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

final class TempUploadController extends Controller
{
    public function store(Request $request)
    {
        $file = $request->file('file');

        $tempPath = $file->storeAs('temp', $file->getClientOriginalName());

        return response()->json([
            'temp_path' => $tempPath,
        ]);
    }

    public function destroy(Request $request)
    {
        $fileUrl = $request->input('fileUrl');
        if (Storage::exists($fileUrl)) {
            Storage::delete($fileUrl);

            return response()->json(['message' => 'File deleted successfully.']);
        }

        return response()->json(['message' => 'File not found.'], 404);
    }
}
