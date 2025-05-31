<?php

namespace App\Http\Controllers\employer;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class ProfileController extends Controller
{
    public function uploadImage(Request $request)
    {
        if ($request->hasFile('file')) {
            $path = $request->file('file')->store('profiles', 'public');
            return response()->json(['url' => $path]);
        }

        return response()->json(['error' => 'No file uploaded'], 400);
    }
    public function removeImage(Request $request)
    {
        $fileUrl = $request->input('fileUrl');

        if (Storage::disk('public')->exists($fileUrl)) {
            Storage::disk('public')->delete($fileUrl);
            return response()->json(['message' => 'File deleted']);
        }
        return response()->json(['message' => 'File not found'], 404);
    }
}
