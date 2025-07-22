<?php

declare(strict_types=1);

namespace App\Http\Controllers\Employer;

use App\Http\Controllers\Controller;
use App\Models\OpeningApplication;
use Prism\Prism\Enums\Provider;
use Prism\Prism\Prism;

final class CandidateMatchController extends Controller
{
    public function score($id): void
    {
        $application = OpeningApplication::with(['user.skills', 'opening.skills'])->findOrFail($id);

        $jobTitle = $application->opening->title;
        $jobSkills = $application->opening->skills->pluck('name')->join(', ');
        $candidateName = $application->user->name;
        $candidateSkills = $application->user->skills->pluck('name')->join(', ');

        $jobText = "{$jobTitle}\n\nSkills: {$jobSkills}";
        $candidateText = "{$candidateName}\n\nSkills: {$candidateSkills}";

        $prompt = <<<EOT
You are an AI assistant helping with recruitment.

Return only JSON like:
{"score": number (0 to 100), "reason": string, "shortlist": boolean, "shortlist_reason": string}

Do not include any explanations or commentary — only return the JSON object.

Job:
{$jobText}

Candidate:
{$candidateText}
EOT;

        $response = Prism::text()
            ->using(Provider::OpenAI, 'gpt-4.1')
            ->withPrompt($prompt)
            ->asText();

        echo $response->text;
    }
}
