<?php

declare(strict_types=1);

namespace App\Http\Controllers\Employer;

use App\Enums\JobStatusEnum;
use App\Http\Controllers\Controller;
use App\Models\Opening;
use App\Models\User;
use Exception;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;
use Prism\Prism\Enums\Provider;
use Prism\Prism\Prism;

final class JobseekerController extends Controller
{
    public function index(Request $request): Response
    {
        $query = User::role('jobseeker')->with('skills', 'resumes');

        if ($request->filled('search')) {
            $query->where('name', 'like', '%'.$request->search.'%');
        }

        $job = null;
        $jobSkills = [];

        if ($request->filled('job_id')) {
            $job = Opening::with('skills')->find($request->job_id);

            if ($job) {
                $jobSkills = $job->skills->pluck('name')->toArray();
            }
        }

        $jobs = Auth::user()
            ->openings()
            ->where('status', JobStatusEnum::Published)
            ->get();

        // Get all users that match the query
        $allUsers = $query->get();

        if ($job && $jobSkills) {
            $this->addMatchScores($allUsers, $job);
        }

        $filteredUsers = $allUsers;

        if ($request->filled('matching_score') && $job && $jobSkills) {
            [$minScore, $maxScore] = array_pad(explode('-', $request->matching_score), 2, null);
            $minScore = is_numeric($minScore) ? (int) $minScore : 0;
            $maxScore = is_numeric($maxScore) ? (int) $maxScore : 100;

            $filteredUsers = $filteredUsers->filter(
                fn ($user): bool => isset($user->match_score)
                    && $user->match_score >= $minScore
                    && $user->match_score <= $maxScore
            );
        }

        if ($job && $jobSkills) {
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

    public function generateSummary(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'skill' => 'required|string',
        ]);

        $cacheKey = sprintf('user_summary:%s:%s', $validated['user_id'], $validated['skill']);

        // Try to get from cache first
        if (Cache::has($cacheKey)) {
            return response()->json([
                'summary' => Cache::get($cacheKey),
                'skill' => $validated['skill'],
            ]);
        }

        $user = User::findOrFail($validated['user_id']);
        $resumeText = $user->resumes()->latest()->value('text');

        if (! $resumeText) {
            return response()->json([
                'summary' => 'No resume text available to analyze',
                'skill' => $validated['skill'],
            ], 400);
        }

        try {
            $response = Prism::text()
                ->using(
                    Provider::OpenRouter,
                    'mistralai/mistral-small-3.2-24b-instruct:free'
                )
                ->withPrompt("
Summarize this candidate's resume with a focus on the skill: {$validated['skill']}.
Keep it concise (2-3 sentences) highlighting:
- Relevant roles or projects
- Years of experience
- Certifications or education related to {$validated['skill']}

Resume: {$resumeText}

If no relevant experience is found, reply exactly:
\"No significant experience with {$validated['skill']} found.\"
                ")
                ->asText();

            $summary = mb_trim($response->text);

            // Cache the result for 24 hours
            Cache::put($cacheKey, $summary, now()->addHours(24));

            return response()->json([
                'summary' => $summary,
                'skill' => $validated['skill'],
            ]);
        } catch (Exception $exception) {
            Log::error('AI Summary Generation Error: '.$exception->getMessage());

            return response()->json([
                'summary' => 'Error generating summary. Please try again later.',
                'skill' => $validated['skill'],
            ], 500);
        }
    }

    private function addMatchScores(Collection $users, Opening $job): void
    {
        $jobTitle = $job->title;
        $jobDescription = $job->description ?? '';

        // Batch process users with resumes to minimize API calls
        $usersWithResumes = $users->filter(fn ($user): bool => ! empty($user->resumes()->latest()->value('text')));

        $usersWithoutResumes = $users->filter(fn ($user): bool => empty($user->resumes()->latest()->value('text')));

        // Set default scores for users without resumes
        foreach ($usersWithoutResumes as $user) {
            $user->match_score = 0;
            $user->match_reason = 'No resume available';
        }

        // Process users with resumes in batches with delays to avoid rate limiting
        $batchSize = 5; // Process 5 users at a time
        $delayBetweenBatches = 1000000; // 1 second delay in microseconds

        $usersWithResumes->chunk($batchSize)->each(function ($batch) use ($jobTitle, $jobDescription, $job, $delayBetweenBatches): void {
            foreach ($batch as $user) {
                $cacheKey = sprintf('user_match:%s:%s', $user->id, $job->id);

                // Try to get from cache first
                if (Cache::has($cacheKey)) {
                    $cachedResult = Cache::get($cacheKey);
                    $user->match_score = $cachedResult['score'];
                    $user->match_reason = $cachedResult['reason'];

                    continue;
                }

                $resumeText = $user->resumes()->latest()->value('text');

                try {
                    $prompt = $this->buildPrompt($jobTitle, $jobDescription, $resumeText);

                    $response = Prism::text()
                        ->using(
                            Provider::OpenRouter,
                            'mistralai/mistral-small-3.2-24b-instruct:free'
                        )
                        ->withPrompt($prompt)
                        ->asText();

                    $responseText = mb_trim($response->text);
                    $responseText = preg_replace('/```(json)?/i', '', $responseText);
                    $responseText = mb_trim($responseText);

                    $jsonStart = mb_strpos($responseText, '{');
                    $jsonEnd = mb_strrpos($responseText, '}');

                    if ($jsonStart !== false && $jsonEnd !== false && $jsonEnd > $jsonStart) {
                        $jsonString = mb_substr($responseText, $jsonStart, $jsonEnd - $jsonStart + 1);
                        $result = json_decode($jsonString, true);

                        if (json_last_error() !== JSON_ERROR_NONE) {
                            throw new Exception('Invalid JSON response from AI service');
                        }

                        $score = (int) ($result['score'] ?? 0);
                        $reason = $result['summary'] ?? 'No summary provided';

                        $user->match_score = $score;
                        $user->match_reason = $reason;

                        // Cache the result for 24 hours
                        Cache::put($cacheKey, [
                            'score' => $score,
                            'reason' => $reason,
                        ], now()->addHours(24));
                    } else {
                        throw new Exception('No JSON found in AI response');
                    }
                } catch (Exception $e) {
                    Log::error('AI Matching Error for user '.$user->id.': '.$e->getMessage());
                    $user->match_score = 0;
                    $user->match_reason = 'Error generating AI match: '.$e->getMessage();
                }
            }

            // Add delay between batches to avoid rate limiting
            usleep($delayBetweenBatches);
        });
    }

    private function buildPrompt(string $jobTitle, string $jobDescription, string $resumeText): string
    {
        return <<<EOT
Analyze how well this candidate's resume matches the job requirements.
Respond ONLY with a valid JSON object, no extra text, no code block.

JSON Schema:
{
  "score": number (0-100),
  "summary": "string"
}

JOB TITLE: {$jobTitle}
JOB DESCRIPTION: {$jobDescription}

CANDIDATE RESUME: {$resumeText}
EOT;
    }
}
