<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Log;
use Prism\Prism\Enums\Provider;
use Prism\Prism\Prism;

final class Profile extends Model
{
    protected $fillable = [
        'user_id',
        'job_title',
        'experience',
        'notice_period',
        'summary',
        'course_completed',
        'student_id',
        'completed_month',
        'is_verified',
    ];

    protected $casts = [
        'is_verified' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    protected static function booted(): void
    {
        static::saving(function (Profile $profile) {
            $profile->summary = $profile->generateAISummary();
        });
    }

    private function generateAISummary(): string
    {
        if (!$this->relationLoaded('user')) {
            $this->load('user.skills', 'user.educations');
        }

        $user = $this->user;

        $prompt = "Write only the following — no title, no formatting, and no explanations.\n\n";
        $prompt .= "A concise, professional summary for a software developer profile with these details:\n";
        $prompt .= "Experience: {$this->experience}\n";
        $prompt .= "Skills: " . $user->skills->pluck('name')->implode(', ') . "\n";
        $prompt .= "Education: " . $user->educations->map(function ($edu) {
            return "{$edu->course_title} at {$edu->institution} ({$edu->start_date}" .
                ($edu->is_current ? " - Present" : " - {$edu->end_date}") .
                ", {$edu->course_type})";
        })->implode(', ') . "\n\n";
        $prompt .= "Output ONLY the final summary text. Do NOT include any headings like 'Professional Summary' or any formatting.";

        $summary = Prism::text()
            ->using(Provider::OpenRouter, 'mistralai/mistral-small-3.2-24b-instruct:free')
            ->withPrompt($prompt)
            ->asText();

        return $summary->text ?? 'Summary generation failed.';
    }
}
