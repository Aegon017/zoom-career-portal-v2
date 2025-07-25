<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

final class WorkExperience extends Model implements HasMedia
{
    use InteractsWithMedia;

    protected $fillable = [
        'user_id',
        'company_id',
        'company_name',
        'title',
        'start_date',
        'end_date',
        'is_current',
    ];

    protected $appends = [
        'logo_url',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('logos')->useDisk('s3')->singleFile();
    }

    public function getLogoUrlAttribute(): string
    {
        return $this->getFirstMediaUrl('logos');
    }

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function getDisplayCompanyNameAttribute(): string
    {
        return $this->company?->name ?? $this->company_name;
    }
}
