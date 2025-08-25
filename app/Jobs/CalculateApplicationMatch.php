<?php

declare(strict_types=1);

namespace App\Jobs;

use App\Models\OpeningApplication;
use Exception;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;
use Prism\Prism\Enums\Provider;
use Prism\Prism\Prism;

final class CalculateApplicationMatch implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct(public OpeningApplication $openingApplication) {}

    /**
     * Execute the job.
     */
    public function handle(Prism $prism): void
    {
        try {
            $response = $prism->text()
                ->using(Provider::OpenRouter, 'mistralai/mistral-small-3.2-24b-instruct:free')
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
                $scoreOnScale = $score;

                $this->openingApplication->update([
                    'match_score' => $scoreOnScale,
                    'match_summary' => $result['summary'] ?? 'No summary provided',
                ]);
            } else {
                throw new Exception('No JSON found in AI response');
            }
        } catch (Exception $exception) {
            Log::error(sprintf('AI Matching failed for application %s: ', $this->openingApplication->id).$exception->getMessage());

            $this->openingApplication->update([
                'match_score' => 0,
                'match_summary' => 'AI matching failed - to be reviewed manually',
            ]);

            throw $exception;
        }
    }

    private function buildPrompt(): string
    {
        return "Analyze how well this candidate's resume matches the job requirements. ".
            "Respond with a JSON object containing:\n".
            "- 'score': a number between 0-100 representing the match percentage\n".
            "- 'summary': a brief explanation of the match\n\n".
            sprintf('JOB TITLE: %s%s', $this->openingApplication->opening->title, PHP_EOL).
            "JOB DESCRIPTION: {$this->openingApplication->opening->description}\n\n".
            "CANDIDATE RESUME: {$this->openingApplication->resume->text}\n\n".
            "RESPONSE FORMAT (JSON only):\n".
            '{"score": number, "summary": "string"}';
    }
}
