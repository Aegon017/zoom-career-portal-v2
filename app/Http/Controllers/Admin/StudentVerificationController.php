<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

final class StudentVerificationController extends Controller
{
    public function show(User $student): Response
    {
        $student->load('profile');

        if (! $student->profile) {
            abort(404, 'Profile not found');
        }

        return Inertia::render('admin/students/verify', [
            'student' => [
                'id' => $student->id,
                'name' => $student->name,
                'email' => $student->email,
                'phone' => $student->phone,
                'profile' => [
                    'course_completed' => $student->profile->course_completed,
                    'student_id' => $student->profile->student_id,
                    'completed_month' => $student->profile->completed_month,
                    'is_verified' => $student->profile->is_verified,
                ],
            ],
        ]);
    }

    /**
     * Approve and verify the student.
     */
    public function verify(User $student): RedirectResponse
    {
        if (! $student->profile) {
            abort(404, 'Profile not found');
        }

        $student->profile->update([
            'is_verified' => true,
        ]);

        return redirect()
            ->route('admin.dashboard')
            ->with('success', 'Student verified successfully.');
    }

    /**
     * Reject the student.
     */
    public function reject(User $student): RedirectResponse
    {
        if (! $student->profile) {
            abort(404, 'Profile not found');
        }

        $student->delete();

        return redirect()
            ->route('admin.dashboard')
            ->with('info', 'Student registration rejected.');
    }
}
