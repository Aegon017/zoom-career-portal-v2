<?php

namespace App\Jobs;

use App\Models\OpeningUserMatch;
use Exception;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;
use Prism\Prism\Enums\Provider;
use Prism\Prism\Prism;

class ProcessOpeningUserMatch implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct(public OpeningUserMatch $match) {}

    /**
     * Execute the job.
     */
    public function handle(Prism $prism): void
    {
        try {
            $response = $prism->text()
                ->using(Provider::Gemini, 'gemini-2.5-flash-lite')
                ->withPrompt($this->buildPrompt())
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

                $score = isset($result['score']) ? (int) $result['score'] : 0;

                $this->match->update([
                    'match_score'   => $score,
                    'match_summary' => $result['summary'] ?? 'No summary provided',
                    'is_calculated' => true,
                ]);
            } else {
                throw new Exception('No JSON found in AI response');
            }
        } catch (Exception $exception) {
            Log::error(sprintf('AI Matching failed for match %s: ', $this->match->id) . $exception->getMessage());

            $this->match->update([
                'match_score'   => 0,
                'match_summary' => 'AI matching failed - to be reviewed manually',
                'is_calculated' => true,
            ]);

            throw $exception;
        }
    }

    private function buildPrompt(): string
    {
        $job   = $this->match->opening;
        $user  = $this->match->user;
        $resumeText = optional($user->resumes()->latest()->first())->text ?? 'No resume available';

        return "Analyze how well this candidate's resume matches the job requirements. " .
            "Respond with a JSON object containing:\n" .
            "- 'score': a number between 0-100 representing the match percentage\n" .
            "- 'summary': a brief explanation of the match\n\n" .
            sprintf("JOB TITLE: %s\n", $job->title) .
            "JOB DESCRIPTION: {$job->description}\n\n" .
            "CANDIDATE RESUME: {$resumeText}\n\n" .
            "RESPONSE FORMAT (JSON only):\n" .
            '{"score": number, "summary": "string"}';
    }
}
