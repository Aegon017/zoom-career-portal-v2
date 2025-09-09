<?php

declare(strict_types=1);

namespace App\Http\Controllers\Employer;

use App\Enums\JobStatusEnum;
use App\Http\Controllers\Controller;
use App\Models\Opening;
use App\Models\User;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Auth;
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
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        $job = null;
        $jobSkills = [];

        if ($request->filled('job_id')) {
            $job = Opening::with('skills')->find($request->job_id);

            if ($job) {
                $jobSkills = $job->skills->pluck('name')->toArray();
                $query->with([
                    'skills' => fn($q) => $q->whereIn('name', $jobSkills)
                ]);
                
            }
        }

        $jobs = Auth::user()
            ->openings()
            ->where('status', JobStatusEnum::Published)
            ->get();

        $initialUsers = $query->paginate(10);

        if ($job && $jobSkills) {
            $this->addMatchScores($initialUsers, $job, $jobSkills);
        }

        if ($request->filled('matching_score')) {
            $range = explode('-', $request->matching_score);
            $minScore = isset($range[0]) ? (int)$range[0] : 0;
            $maxScore = isset($range[1]) ? (int)$range[1] : 100;

            $initialUsers->setCollection(
                $initialUsers->getCollection()->filter(function ($user) use ($minScore, $maxScore) {
                    return isset($user->match_score) && $user->match_score >= $minScore && $user->match_score <= $maxScore;
                })->values()
            );
        }

        return Inertia::render('employer/jobseekers-listing', [
            'initialUsers' => $initialUsers,
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
            'skill'   => 'required|string',
        ]);

        $user = User::findOrFail($validated['user_id']);
        $resumeText = $user->resumes()->latest()->value('text');

        if (!$resumeText) {
            return response()->json([
                'summary' => 'No resume text available to analyze',
                'skill'   => $validated['skill'],
            ], 400);
        }

        $prompt = $this->createPromptFromResume($resumeText, $validated['skill']);

        try {
            $response = Prism::text()
                ->using(
                    Provider::OpenRouter,
                    'mistralai/mistral-small-3.2-24b-instruct:free'
                )
                ->withPrompt($prompt)
                ->asText();

            return response()->json([
                'summary' => trim($response->text),
                'skill'   => $validated['skill'],
            ]);
        } catch (Exception $e) {
            return response()->json([
                'summary' => 'Error generating summary',
                'skill'   => $validated['skill'],
            ], 500);
        }
    }

    private function addMatchScores(
        LengthAwarePaginator $users,
        Opening $job,
        array $jobSkills
    ): void {
        $jobTitle     = $job->title;
        $jobSkillsTxt = implode(', ', $jobSkills);

        $users->getCollection()->transform(
            function ($user) use ($jobTitle, $jobSkillsTxt, $jobSkills) {
                $candidateSkills     = $user->skills->pluck('name')->toArray();
                $candidateSkillsText = implode(', ', $candidateSkills);

                if (empty($candidateSkills)) {
                    $user->match_score = 0;
                    return $user;
                }

                try {
                    $prompt = $this->buildPrompt(
                        $jobTitle,
                        $jobSkillsTxt,
                        $user->name,
                        $candidateSkillsText
                    );

                    $response = Prism::text()
                        ->using(
                            Provider::OpenRouter,
                            'mistralai/mistral-small-3.2-24b-instruct:free'
                        )
                        ->withPrompt($prompt)
                        ->asText();

                    $responseText = $response->text;

                    $jsonStart = mb_strpos($responseText, '{');
                    $jsonEnd = mb_strrpos($responseText, '}');

                    if ($jsonStart !== false && $jsonEnd !== false && $jsonEnd > $jsonStart) {
                        $jsonString = mb_substr($responseText, $jsonStart, $jsonEnd - $jsonStart + 1);
                        $result = json_decode($jsonString, true);

                        if (json_last_error() !== JSON_ERROR_NONE) {
                            throw new Exception('Invalid JSON response from AI service');
                        }

                        $user->match_score     = $result['score'] ?? 0;
                        $user->match_reason    = $result['reason'] ?? '';
                        $user->shortlist_reason = $result['shortlist_reason'] ?? '';
                        $user->is_shortlisted  = $result['shortlist'] ?? false;
                    } else {
                        throw new Exception('No JSON found in AI response');
                    }
                } catch (Exception) {
                    $user->match_score = $this->calculateSimpleMatch(
                        $jobSkills,
                        $candidateSkills
                    );
                }

                return $user;
            }
        );
    }

    private function buildPrompt(
        string $jobTitle,
        string $jobSkills,
        string $candidateName,
        string $candidateSkills
    ): string {
        return <<<EOT
Analyze the match between the job and candidate. Return JSON with:
- score (0-100)
- reason (string)
- shortlist (boolean)
- shortlist_reason (string)

Job: {$jobTitle}
Required Skills: {$jobSkills}
Candidate: {$candidateName}
Candidate Skills: {$candidateSkills}
EOT;
    }

    private function calculateSimpleMatch(
        array $jobSkills,
        array $candidateSkills
    ): int {
        if (empty($jobSkills)) {
            return 0;
        }

        $matched = count(array_intersect($jobSkills, $candidateSkills));

        return (int) round(($matched / count($jobSkills)) * 100);
    }

    private function createPromptFromResume(
        string $resumeText,
        string $skill
    ): string {
        return <<<PROMPT
Analyze this resume for experience with "{$skill}".
Provide a concise 2-3 sentence summary focusing on:
- Years of experience
- Relevant roles/projects
- Certifications/education

Resume: {$resumeText}

If no experience found, state:
"No significant experience with {$skill} found."
PROMPT;
    }
}
