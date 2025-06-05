<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

final class TempUploadController extends Controller
{
    public function store(Request $request)
    {
        $file = $request->file('profile_image');
        $tempPath = $file->storeAs('temp', Str::uuid().'.'.$file->getClientOriginalExtension(), 'public');

        return response()->json([
            'temp_path' => $tempPath,
            'original_name' => $file->getClientOriginalName(),
            'mime_type' => $file->getClientMimeType(),
        ]);
    }

    public function destroy(Request $request)
    {
        $fileUrl = $request->input('fileUrl');
        if (Storage::disk('public')->exists($fileUrl)) {
            Storage::disk('public')->delete($fileUrl);

            return response()->json(['message' => 'File deleted successfully.']);
        }

        return response()->json(['message' => 'File not found.'], 404);
    }
}
