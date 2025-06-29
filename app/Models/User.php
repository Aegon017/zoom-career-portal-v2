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
        'password' => 'hashed',
    ];

    protected $appends = [
        'avatar_url',
        'banner_url',
        'resume_urls',
    ];

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('avatars')->singleFile();
        $this->addMediaCollection('banners')->singleFile();
        $this->addMediaCollection('resumes');
    }

    public function getAvatarUrlAttribute(): ?string
    {
        return $this->getFirstMediaUrl('avatars');
    }

    public function getBannerUrlAttribute(): ?string
    {
        return $this->getFirstMediaUrl('banners');
    }

    public function getResumeUrlsAttribute(): array
    {
        return $this->getMedia('resumes')->map->getUrl()->toArray();
    }

    public function profile(): HasOne
    {
        return $this->hasOne(Profile::class);
    }

    public function address(): MorphOne
    {
        return $this->morphOne(Address::class, 'addressable');
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

    public function employerProfile(): HasOne
    {
        return $this->hasOne(EmployerProfile::class);
    }

    public function jobSeekerProfile(): HasOne
    {
        return $this->hasOne(JobSeekerProfile::class);
    }

    public function getRoleForCompany(Company $company): ?string
    {
        return $this->companies()->where('company_id', $company->id)->first()?->pivot?->role;
    }

    public function workExperiences()
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

    public function follows()
    {
        return $this->hasMany(Follow::class, 'follower_id');
    }

    public function followingUsers()
    {
        return $this->morphedByMany(self::class, 'followable', 'follows', 'follower_id');
    }

    public function followingCompanies()
    {
        return $this->morphedByMany(Company::class, 'followable', 'follows', 'follower_id');
    }

    public function followers()
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
        return $this->belongsToMany(Skill::class, 'skill_users')->withTimestamps();
    }

    public function chatUsers()
    {
        return $this->hasMany(ChatUser::class);
    }

    public function chats()
    {
        return $this->belongsToMany(Chat::class, 'chat_users')->withTimestamps();
    }
}
