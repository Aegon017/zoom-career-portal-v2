<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Feedback;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class FeedbackController extends Controller
{
    public function __construct(private User $user) {}

    public function index(Request $request)
    {
        Gate::authorize('view_any_feedback', $this->user);

        $feedback = Feedback::query()
            ->with(['user', 'opening'])
            ->when(
                $request->search,
                function ($query, $search) {
                    $query->whereHas('user', function ($q) use ($search) {
                        $q->where('name', 'like', '%' . $search . '%')
                            ->orWhere('email', 'like', '%' . $search . '%');
                    })
                        ->orWhereHas('opening', function ($q) use ($search) {
                            $q->where('title', 'like', '%' . $search . '%');
                        })
                        ->orWhere('feedback', 'like', '%' . $search . '%');
                }
            )
            ->paginate($request->perPage ?? 10)
            ->withQueryString();

        return Inertia::render('admin/feedback/feedback-listing', [
            'feedback' => $feedback,
            'filters' => $request->only('search', 'perPage'),
        ]);
    }

    public function show(Feedback $feedback)
    {
        Gate::authorize('view_feedback', $this->user);

        return Inertia::render('admin/feedback/feedback-details', [
            'feedback' => $feedback->load(['user', 'opening'])
        ]);
    }
}
