<?php

declare(strict_types=1);

namespace App\Http\Controllers\Employer;

use App\Enums\JobStatusEnum;
use App\Http\Controllers\Controller;
use App\Models\Opening;
use App\Models\OpeningUserMatch;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

final class JobseekerController extends Controller
{
    public function index(Request $request): Response
    {
        $query = User::role('jobseeker')->with('skills', 'resumes');

        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        $job = null;
        if ($request->filled('job_id')) {
            $job = Opening::with('skills')->find($request->job_id);
        }

        $jobs = Auth::user()
            ->openings()
            ->where('status', JobStatusEnum::Published)
            ->get();

        $allUsers = $query->get();

        if ($job) {
            $this->addMatchScores($allUsers, $job);
        }

        $filteredUsers = $allUsers;

        if ($request->filled('matching_score') && $job) {
            [$minScore, $maxScore] = array_pad(explode('-', $request->matching_score), 2, null);
            $minScore = is_numeric($minScore) ? (int) $minScore : 0;
            $maxScore = is_numeric($maxScore) ? (int) $maxScore : 100;

            $filteredUsers = $filteredUsers->filter(
                fn($user): bool => isset($user->match_score)
                    && $user->match_score >= $minScore
                    && $user->match_score <= $maxScore
            );
        }

        if ($job) {
            $filteredUsers = $filteredUsers->sortByDesc('match_score');
        }

        $perPage = 10;
        $currentPage = LengthAwarePaginator::resolveCurrentPage();
        $currentItems = $filteredUsers->slice(($currentPage - 1) * $perPage, $perPage)->values();

        $paginatedUsers = new LengthAwarePaginator(
            $currentItems,
            $filteredUsers->count(),
            $perPage,
            $currentPage,
            ['path' => $request->url(), 'query' => $request->query()]
        );

        return Inertia::render('employer/jobseekers-listing', [
            'initialUsers' => $paginatedUsers,
            'jobs' => $jobs,
        ]);
    }

    public function show(User $user): Response
    {
        $user->load([
            'skills',
            'profile',
            'resumes.media',
            'workExperiences.company',
            'educations',
            'personalDetail',
            'address.location',
            'workPermits',
            'userLanguages.language',
            'certificates',
        ]);

        $resume = $user->resumes()->latest()->first();

        return Inertia::render('employer/jobseeker-profile', [
            'user' => $user,
            'resume' => $resume,
        ]);
    }

    private function addMatchScores(Collection $users, Opening $job): void
    {
        $matches = OpeningUserMatch::where('opening_id', $job->id)
            ->whereIn('user_id', $users->pluck('id'))
            ->get()
            ->keyBy('user_id');

        foreach ($users as $user) {
            if (isset($matches[$user->id])) {
                $user->match_score = $matches[$user->id]->match_score;
                $user->match_reason = $matches[$user->id]->match_summary;
            } else {
                $user->match_score = 0;
                $user->match_reason = 'Not yet calculated';
            }
        }
    }
}