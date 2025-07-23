<?php

declare(strict_types=1);

namespace App\Http\Controllers\Employer;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
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
            $query->where('name', 'like', '%'.$request->search.'%');
        }

        if ($request->filled('skill') && $request->skill !== 'all') {
            $query->whereHas('skills', function ($q) use ($request): void {
                $q->where('name', $request->skill);
            });
        }

        $initialUsers = $query->with('skills')->paginate(10)->withQueryString();

        return Inertia::render('employer/jobseekers-listing', [
            'initialUsers' => $initialUsers,
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
