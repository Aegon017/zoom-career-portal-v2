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
                ->using(Provider::OpenAI, 'gpt-4')
                ->withPrompt($this->buildPrompt())
                ->asText();

            $responseText = $response->text;

            $result = json_decode($responseText, true);

            if (json_last_error() !== JSON_ERROR_NONE) {
                throw new Exception('Invalid JSON response from AI service');
            }

            $this->openingApplication->update([
                'match_score' => $result['score'] ?? null,
                'match_summary' => $result['summary'] ?? null,
            ]);
        } catch (Exception $exception) {
            Log::error(sprintf('AI Matching failed for application %s: ', $this->openingApplication->id).$exception->getMessage());

            $this->openingApplication->update([
                'match_score' => 0,
                'match_summary' => 'AI matching failed - to be reviewed manually',
            ]);

            // Re-throw to allow for retries if needed
            throw $exception;
        }
    }

    private function buildPrompt(): string
    {
        return "Analyze this job application and respond with JSON containing 'score' (0-100) and 'summary':\n\n".
            sprintf('Job: %s%s', $this->openingApplication->opening->title, PHP_EOL).
            "Description: {$this->openingApplication->opening->description}\n\n".
            "Resume: {$this->openingApplication->resume->text}\n\n".
            'Respond only with: {"score": number, "summary": string}';
    }
}
