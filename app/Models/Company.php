<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\CompanySizeEnum;
use App\Enums\CompanyTypeEnum;
use App\Enums\VerificationStatusEnum;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Auth;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

final class Company extends Model implements HasMedia
{
    use HasFactory;
    use InteractsWithMedia;

    protected $fillable = [
        'company_name',
        'industry',
        'company_website',
        'company_description',
        'company_address',
        'public_phone',
        'public_email',
        'company_size',
        'company_type',
        'verification_status',
    ];

    protected $casts = [
        'company_size' => CompanySizeEnum::class,
        'company_type' => CompanyTypeEnum::class,
        'verification_status' => VerificationStatusEnum::class,
    ];

    protected $appends = [
        'company_logo',
        'banner',
        'is_followed',
    ];

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('company_logos')->singleFile();
        $this->addMediaCollection('banner')->singleFile();
    }

    public function getCompanyLogoAttribute(): string
    {
        return $this->getFirstMediaUrl('company_logos');
    }

    public function getBannerAttribute(): string
    {
        return $this->getFirstMediaUrl('banners');
    }

    public function openings(): HasMany
    {
        return $this->hasMany(Opening::class);
    }

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'company_user')
            ->withPivot(['status', 'role', 'verified_at'])
            ->withTimestamps();
    }

    public function workExperiences(): HasMany
    {
        return $this->hasMany(WorkExperience::class);
    }

    public function getIsFollowedAttribute()
    {
        if (! Auth::check()) {
            return false;
        }

        return $this->followers()->where('users.id', Auth::id())->exists();
    }

    public function followers()
    {
        return $this->morphToMany(User::class, 'followable', 'follows', 'followable_id', 'follower_id');
    }
}
