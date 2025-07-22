<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\MorphOne;
use Illuminate\Database\Eloquent\Relations\MorphToMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\Permission\Traits\HasRoles;

final class User extends Authenticatable implements HasMedia, MustVerifyEmail
{
    use HasFactory;
    use HasRoles;
    use InteractsWithMedia;
    use Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'phone',
        'password',
        'email_verified_at',
        'phone_verified_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'phone_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    protected $appends = [
        'avatar_url',
        'banner_url',
    ];

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('avatars')->singleFile();
        $this->addMediaCollection('banners')->singleFile();
    }

    public function getAvatarUrlAttribute(): ?string
    {
        return $this->getFirstMediaUrl('avatars');
    }

    public function getBannerUrlAttribute(): ?string
    {
        return $this->getFirstMediaUrl('banners');
    }

    public function otps(): HasMany
    {
        return $this->hasMany(Otp::class);
    }

    public function latestOtp(): HasOne
    {
        return $this->hasOne(Otp::class)->latestOfMany();
    }

    public function isPhoneVerified(): bool
    {
        return ! is_null($this->phone_verified_at);
    }

    public function profile(): HasOne
    {
        return $this->hasOne(Profile::class);
    }

    public function address(): MorphOne
    {
        return $this->morphOne(Address::class, 'addressable');
    }

    public function resumes(): HasMany
    {
        return $this->hasMany(Resume::class);
    }

    public function companyUsers(): HasMany
    {
        return $this->hasMany(CompanyUser::class);
    }

    public function companies(): BelongsToMany
    {
        return $this->belongsToMany(Company::class, 'company_users');
    }

    public function employerOnBording(): HasOne
    {
        return $this->hasOne(EmployerOnBoarding::class);
    }

    public function getRoleForCompany(Company $company): ?string
    {
        $companyUser = $this->companyUsers()->where('company_id', $company->id)->first();

        return $companyUser?->role;
    }

    public function workExperiences(): HasMany
    {
        return $this->hasMany(WorkExperience::class);
    }

    public function savedOpenings(): HasMany
    {
        return $this->hasMany(SavedOpening::class);
    }

    public function openingApplications(): HasMany
    {
        return $this->hasMany(OpeningApplication::class);
    }

    public function openingApplicationsReceived(): HasManyThrough
    {
        return $this->hasManyThrough(
            OpeningApplication::class,
            Opening::class,
            'user_id',
            'opening_id',
            'id',
            'id'
        );
    }

    public function follows(): HasMany
    {
        return $this->hasMany(Follow::class, 'follower_id');
    }

    public function followingUsers(): MorphToMany
    {
        return $this->morphedByMany(self::class, 'followable', 'follows', 'follower_id');
    }

    public function followingCompanies(): MorphToMany
    {
        return $this->morphedByMany(Company::class, 'followable', 'follows', 'follower_id');
    }

    public function followers(): MorphToMany
    {
        return $this->morphToMany(self::class, 'followable', 'follows', 'followable_id', 'follower_id');
    }

    public function shortlists(): HasMany
    {
        return $this->hasMany(Shortlist::class);
    }

    public function skillUsers(): HasMany
    {
        return $this->hasMany(SkillUser::class);
    }

    public function skills(): BelongsToMany
    {
        return $this->belongsToMany(Skill::class, 'skill_users');
    }

    public function chatParticipants(): HasMany
    {
        return $this->hasMany(ChatParticipant::class);
    }

    public function chats(): BelongsToMany
    {
        return $this->belongsToMany(Chat::class, 'chat_participants');
    }

    public function careerInterest(): HasOne
    {
        return $this->hasOne(CareerInterest::class);
    }

    public function certificates(): HasMany
    {
        return $this->hasMany(Certificate::class);
    }

    public function educations(): HasMany
    {
        return $this->hasMany(Education::class);
    }

    public function userLanguages(): HasMany
    {
        return $this->hasMany(UserLanguage::class);
    }

    public function personalDetail(): HasOne
    {
        return $this->hasOne(PersonalDetail::class);
    }

    public function workPermits(): HasMany
    {
        return $this->hasMany(WorkPermit::class);
    }
}
