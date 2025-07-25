<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\CompanySizeEnum;
use App\Enums\CompanyTypeEnum;
use App\Enums\VerificationStatusEnum;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphOne;
use Illuminate\Support\Facades\Auth;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

final class Company extends Model implements HasMedia
{
    use HasFactory;
    use InteractsWithMedia;

    protected $fillable = [
        'name',
        'industry_id',
        'website_url',
        'description',
        'email',
        'phone',
        'size',
        'type',
        'verification_status',
    ];

    protected $casts = [
        'company_size' => CompanySizeEnum::class,
        'company_type' => CompanyTypeEnum::class,
        'verification_status' => VerificationStatusEnum::class,
    ];

    protected $appends = [
        'logo_url',
        'banner_url',
        'is_followed',
    ];

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('logos')->useDisk('s3')->singleFile();
        $this->addMediaCollection('banners')->useDisk('s3')->singleFile();
    }

    public function getLogoUrlAttribute(): string
    {
        return $this->getFirstMediaUrl('logos');
    }

    public function getBannerUrlAttribute(): string
    {
        return $this->getFirstMediaUrl('banners');
    }

    public function industry(): BelongsTo
    {
        return $this->belongsTo(Industry::class);
    }

    public function address(): MorphOne
    {
        return $this->morphOne(Address::class, 'addressable');
    }

    public function companyUsers(): HasMany
    {
        return $this->hasMany(CompanyUser::class);
    }

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'company_users', 'company_id', 'user_id');
    }

    public function openings(): HasMany
    {
        return $this->hasMany(Opening::class);
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
