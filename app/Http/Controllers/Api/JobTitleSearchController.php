<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\OpeningTitle;
use Illuminate\Http\Request;

class JobTitleSearchController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        $request->validate([
            'search' => 'sometimes|string|max:255',
        ]);

        $query = OpeningTitle::query();

        if ($request->has('search') && !empty($request->search)) {
            $search = $request->search;
            $query->where('name', 'like', "%{$search}%");
        }

        $jobTitles = $query->orderBy('name')
            ->limit(10)
            ->get()
            ->map(function ($jobTitle) {
                return [
                    'value' => (string) $jobTitle->id,
                    'label' => $jobTitle->name,
                ];
            });

        return response()->json($jobTitles);
    }
}
