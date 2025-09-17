<?php

declare(strict_types=1);

namespace App\Models;

use App\Observers\ResumeObserver;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

#[ObservedBy([ResumeObserver::class])]
final class Resume extends Model implements HasMedia
{
    use InteractsWithMedia;

    protected $fillable = ['user_id', 'text'];

    protected $appends = ['resume_url'];

    public function getResumeUrlAttribute(): string
    {
        return $this->getFirstMediaUrl('resumes');
    }

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('resumes')

            ->acceptsMimeTypes([
                'application/pdf',
            ])
            ->singleFile();
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function applications(): HasMany
    {
        return $this->hasMany(OpeningApplication::class, 'resume_id');
    }
}
