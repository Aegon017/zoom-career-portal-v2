<?php

namespace App\Http\Controllers\Jobseeker;

use App\Http\Controllers\Controller;
use App\Models\Resume;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\MediaLibrary\MediaCollections\Exceptions\FileCannotBeAdded;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class ResumeController extends Controller
{
    public function index(): Response
    {
        $resumes = Auth::user()->resumes()
            ->with('media')
            ->get()
            ->map(function ($resume) {
                $media = $resume->getFirstMedia('resumes');

                return $media ? [
                    'id' => $media->id,
                    'name' => $media->file_name,
                    'url' => $media->getUrl(),
                    'uploaded_at' => $media->created_at->toDateTimeString(),
                ] : null;
            })
            ->filter()
            ->values();

        return Inertia::render('jobseeker/my-resumes', [
            'resumes' => $resumes,
        ]);
    }

    public function data(): JsonResponse
    {
        $resumes = Auth::user()->resumes()
            ->with('media')
            ->get()
            ->map(function ($resume) {
                $media = $resume->getFirstMedia('resumes');
                return $media ? [
                    'id' => $media->id,
                    'name' => $media->file_name,
                    'url' => $media->getUrl(),
                    'uploaded_at' => $media->created_at->toDateTimeString(),
                ] : null;
            })
            ->filter()
            ->values();

        return response()->json($resumes);
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'resume' => ['required', 'string', 'regex:/^temp\/[a-z0-9_\-\.]+$/i'],
        ], [
            'resume.regex' => 'Invalid file path format. Only temporary files are allowed.',
            'resume.required' => 'Please select a resume to upload.',
        ]);

        $path = $request->resume;
        $user = Auth::user();

        if (!Storage::disk('public')->exists($path)) {
            return back()->withErrors(['resume' => 'File not found. Please upload again.']);
        }

        try {
            $resume = $user->resumes()->create();
            $resume->addMedia(Storage::disk('public')->path($path))->toMediaCollection('resumes');
            Storage::disk('public')->delete($path);

            return back()->with('success', 'Resume uploaded successfully');
        } catch (FileCannotBeAdded $e) {
            return back()->withErrors(['resume' => 'Upload failed: ' . $e->getMessage()]);
        }
    }

    public function destroy(string $id): RedirectResponse
    {
        $user = Auth::user();

        $media = Media::where('id', $id)
            ->whereHasMorph(
                'model',
                [Resume::class],
                fn($query) => $query->where('user_id', $user->id)
            )->firstOrFail();

        try {
            $user->resumes()
                ->whereHas('media', fn($q) => $q->where('id', $id))
                ->firstOrFail()
                ->delete();

            return back()->with('success', 'Resume deleted successfully.');
        } catch (\Exception $e) {
            return back()->withErrors(['message' => 'Failed to delete resume: ' . $e->getMessage()]);
        }
    }
}
