<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

final class OpeningApplication extends Model implements HasMedia
{
    use InteractsWithMedia;

    protected $fillable = ['user_id', 'opening_id', 'cover_letter', 'status'];

    protected $appends = ['resume'];

    public function getResumeAttribute(): string
    {
        return $this->getFirstMediaUrl('resume');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function opening(): BelongsTo
    {
        return $this->belongsTo(Opening::class);
    }

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('resumes')->singleFile();
    }
}
