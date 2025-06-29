<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Illuminate\Database\Eloquent\Relations\HasOne;
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
        'password',
        'email_verified_at',
        'phone',
        'headline',
        'pronouns',
        'location',
        'banner',
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

    protected $appends = ['profile_image'];

    public function getProfileImageAttribute(): string
    {
        return $this->getFirstMediaUrl('profile_images');
    }

    public function employerOnBording(): HasOne
    {
        return $this->hasOne(EmployerOnBoarding::class);
    }

    public function employerProfile(): HasOne
    {
        return $this->hasOne(EmployerProfile::class);
    }

    public function companyUsers(): HasMany
    {
        return $this->hasMany(CompanyUser::class);
    }

    public function companies(): BelongsToMany
    {
        return $this->belongsToMany(Company::class, 'company_users');
    }

    public function jobSeekerProfile(): HasOne
    {
        return $this->hasOne(JobSeekerProfile::class);
    }

    public function getRoleForCompany(Company $company): ?string
    {
        $companyUser = $this->companyUsers()->where('company_id', $company->id)->first();
        return $companyUser?->role;
    }

    public function workExperiences()
    {
        return $this->hasMany(WorkExperience::class);
    }

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('profile_images')->singleFile();
        $this->addMediaCollection('resumes');
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
        return $this->belongsToMany(Chat::class, 'chat_users');
    }
}
