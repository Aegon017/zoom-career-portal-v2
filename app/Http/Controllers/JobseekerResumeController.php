<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

final class JobseekerResumeController extends Controller
{
    public function index()
    {
        $resumes = Auth::user()->getMedia('resumes')->map(fn ($media): array => [
            'id' => $media->id,
            'name' => $media->file_name,
            'url' => $media->getUrl(),
            'uploaded_at' => $media->created_at->toDateTimeString(),
        ]);

        return Inertia::render('jobseeker/my-documents', [
            'resumes' => $resumes,
        ]);
    }

    public function data()
    {
        $resumes = Auth::user()->getMedia('resumes')->map(fn ($media): array => [
            'id' => $media->id,
            'name' => $media->file_name,
            'url' => $media->getUrl(),
            'uploaded_at' => $media->created_at->toDateTimeString(),
        ]);

        return response()->json($resumes);
    }

    public function store(Request $request)
    {
        $request->validate([
            'resume' => ['required', 'string'],
        ]);

        $user = Auth::user();

        if ($request->resume && Storage::disk('public')->exists($request->resume)) {
            $user->addMedia(storage_path('app/public/'.$request->resume))
                ->preservingOriginal()
                ->toMediaCollection('resumes');
        }

        return back()->with('success', 'Resume uploaded successfully');
    }

    public function destroy(string $id)
    {
        $user = Auth::user();

        $media = Media::where('id', $id)->first();

        if (! $user->getMedia('resumes')->contains('id', $media->id)) {
            abort(403, 'Unauthorized to delete this resume.');
        }

        $media->delete();

        return back()->with('success', 'Resume deleted successfully.');
    }
}
