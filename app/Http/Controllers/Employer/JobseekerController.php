<?php

declare(strict_types=1);

namespace App\Http\Controllers\Employer;

use App\Enums\JobStatusEnum;
use App\Http\Controllers\Controller;
use App\Models\Opening;
use App\Models\User;
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
        $query = User::query()->role('jobseeker');

        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        $job = null;
        $jobSkills = [];

        if ($request->filled('job_id')) {
            $job = Opening::with('skills')->find($request->job_id);
            if ($job) {
                $jobSkills = $job->skills->pluck('name')->toArray();
                
                $query->with(['skills' => function ($query) use ($jobSkills) {
                    $query->whereIn('name', $jobSkills);
                }]);
            }
        }

        $jobs = Auth::user()->openings()->where('status', JobStatusEnum::Published)->get();

        $initialUsers = $query->with('skills','resumes')->paginate(10);
        
        if ($job && count($jobSkills)) {
            $this->addMatchScores($initialUsers, $job, $jobSkills);
        }

        return Inertia::render('employer/jobseekers-listing', [
            'initialUsers' => $initialUsers,
            'jobs' => $jobs
        ]);
    }

    private function addMatchScores(LengthAwarePaginator $users, Opening $job, array $jobSkills): void
    {
        $jobTitle = $job->title;
        $jobSkillsText = implode(', ', $jobSkills);
        
        $users->getCollection()->transform(function ($user) use ($jobTitle, $jobSkillsText) {
            $candidateSkills = $user->skills->pluck('name')->join(', ');
            
            if (!empty($candidateSkills)) {
                $prompt = $this->buildPrompt(
                    $jobTitle,
                    $jobSkillsText,
                    $user->name,
                    $candidateSkills
                );
                
                try {
                    $response = Prism::text()
                        ->using(Provider::OpenAI, 'gpt-4.1')
                        ->withPrompt($prompt)
                        ->asText();
                    
                    if ($json = json_decode($response->text, true)) {
                        $user->match_score = $json['score'] ?? 0;
                        $user->match_reason = $json['reason'] ?? '';
                        $user->shortlist_reason = $json['shortlist_reason'] ?? '';
                        $user->is_shortlisted = $json['shortlist'] ?? false;
                    }
                } catch (\Exception $e) {
                    $user->match_score = $this->calculateSimpleMatch(
                        $jobSkillsText, 
                        $candidateSkills
                    );
                }
            } else {
                $user->match_score = 0;
            }
            
            return $user;
        });
    }

    private function buildPrompt(
        string $jobTitle, 
        string $jobSkills,
        string $candidateName,
        string $candidateSkills
    ): string {
        return <<<EOT
You are an AI assistant helping with recruitment.

Return only JSON like:
{"score": number (0 to 100), "reason": string, "shortlist": boolean, "shortlist_reason": string}

Do not include any explanations or commentary — only return the JSON object.

Job:
{$jobTitle}

Required Skills:
{$jobSkills}

Candidate:
{$candidateName}

Candidate Skills:
{$candidateSkills}
EOT;
    }

    private function calculateSimpleMatch(string $jobSkills, string $candidateSkills): int
    {
        $jobSkillsArray = explode(', ', $jobSkills);
        $candidateSkillsArray = explode(', ', $candidateSkills);
        
        $matched = array_intersect($jobSkillsArray, $candidateSkillsArray);
        
        if (count($jobSkillsArray)) {
            return (int) round((count($matched) / count($jobSkillsArray)) * 100);
        }
        
        return 0;
    }

    public function show(User $user): Response
    {
        $user->load(['skills', 'profile', 'resumes', 'workExperiences.company', 'educations', 'personalDetail', 'address.location', 'workPermits', 'userLanguages.language', 'certificates']);
        $resume = $user->resumes()->with('media')->latest()->first();

        return Inertia::render('employer/jobseeker-profile', [
            'user' => $user,
            'resume' => $resume
        ]);
    }

    public function generateSummary(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'skill' => 'required|string',
        ]);

        $user = User::findOrFail($request->user_id);

        $resumeText = optional($user->resumes()->latest()->first())->text;

        if (empty($resumeText)) {
            return response()->json([
                'summary' => 'No resume text available to analyze',
                'skill' => $request->skill,
            ], 400);
        }

        $prompt = $this->createPromptFromResume($resumeText, $request->skill);

        $response = Prism::text()
            ->using(Provider::OpenAI, 'gpt-4.1')
            ->withPrompt($prompt)
            ->asText();

        return response()->json([
            'summary' => mb_trim($response->text),
            'skill' => $request->skill,
        ]);
    }

    /**
     * Generate an AI prompt to summarize a candidate's experience with a specific skill.
     * This prompt is used to analyze each candidate's resume and profile for the selected skill.
     * The summary should be concise and help employers quickly understand the candidate's fit.
     */
    private function createPromptFromResume(string $resumeText, string $skill): string
    {
        return <<<PROMPT
Analyze the following candidate's resume and profile for experience related to "{$skill}". Write a concise 2-3 sentence summary for employers to quickly understand the candidate's relevant background, to be displayed on their candidate card.

Focus on:
- Years of experience with "{$skill}" (if mentioned)
- Relevant roles, projects, or achievements involving "{$skill}"
- Certifications or education related to "{$skill}"

Resume and Profile:
{$resumeText}

If no significant experience with "{$skill}" is found, state: "No significant experience with {$skill} found in resume."
Keep the summary professional and easy to scan.
PROMPT;
    }
}
