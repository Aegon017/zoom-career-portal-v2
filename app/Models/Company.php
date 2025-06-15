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
    use HasFactory, InteractsWithMedia;

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
        'is_followed',
    ];

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('company_logo')->singleFile();
    }

    public function getCompanyLogoAttribute()
    {
        return $this->getFirstMediaUrl('company_logo');
    }

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'company_user')
            ->withPivot('role')
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
