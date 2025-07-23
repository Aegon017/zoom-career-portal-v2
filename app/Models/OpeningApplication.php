<?php

declare(strict_types=1);

namespace App\Models;

use App\Jobs\CalculateApplicationMatch;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

final class OpeningApplication extends Model implements HasMedia
{
    use InteractsWithMedia;

    protected $fillable = ['user_id', 'opening_id', 'resume_id', 'cover_letter', 'status', 'match_score', 'match_summary'];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function resume(): BelongsTo
    {
        return $this->belongsTo(Resume::class);
    }

    public function opening(): BelongsTo
    {
        return $this->belongsTo(Opening::class);
    }

    protected static function booted(): void
    {
        self::created(function (OpeningApplication $openingApplication): void {
            CalculateApplicationMatch::dispatch($openingApplication)->delay(now()->addSeconds(10));
        });
    }
}
