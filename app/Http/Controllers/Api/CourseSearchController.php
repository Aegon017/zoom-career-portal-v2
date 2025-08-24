<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Course;
use Illuminate\Http\Request;

class CourseSearchController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        $request->validate([
            'search' => 'sometimes|string|max:255',
        ]);

        $query = Course::query();

        if ($request->has('search') && !empty($request->search)) {
            $search = $request->search;
            $query->where('name', 'like', "%{$search}%");
        }

        $courses = $query->orderBy('name')
            ->limit(10)
            ->get()
            ->map(function ($course) {
                return [
                    'value' => (string) $course->id,
                    'label' => $course->name,
                ];
            });

        return response()->json($courses);
    }
}
