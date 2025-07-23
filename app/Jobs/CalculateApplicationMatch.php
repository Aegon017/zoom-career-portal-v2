<?php

namespace App\Jobs;

use App\Models\Opening;
use App\Models\OpeningApplication;
use App\Models\Resume;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;
use Prism\Prism\Enums\Provider;
use Prism\Prism\Prism;

class CalculateApplicationMatch implements ShouldQueue
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
                throw new \Exception('Invalid JSON response from AI service');
            }

            $this->openingApplication->update([
                'match_score' => $result['score'] ?? null,
                'match_summary' => $result['summary'] ?? null,
            ]);
        } catch (\Exception $e) {
            Log::error("AI Matching failed for application {$this->openingApplication->id}: " . $e->getMessage());

            $this->openingApplication->update([
                'match_score' => 0,
                'match_summary' => 'AI matching failed - to be reviewed manually',
            ]);

            // Re-throw to allow for retries if needed
            throw $e;
        }
    }

    private function buildPrompt(): string
    {
        return "Analyze this job application and respond with JSON containing 'score' (0-100) and 'summary':\n\n" .
            "Job: {$this->openingApplication->opening->title}\n" .
            "Description: {$this->openingApplication->opening->description}\n\n" .
            "Resume: {$this->openingApplication->resume->text}\n\n" .
            "Respond only with: {\"score\": number, \"summary\": string}";
    }
}
