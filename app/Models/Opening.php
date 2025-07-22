<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphOne;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;

final class Opening extends Model
{
    use HasFactory;

    protected $fillable = [
        'company_id',
        'user_id',
        'industry_id',
        'title',
        'employment_type',
        'work_model',
        'description',
        'salary_min',
        'salary_max',
        'salary_unit',
        'currency',
        'published_at',
        'expires_at',
        'apply_link',
        'status',
        'verification_status',
    ];

    protected $casts = [
        'salary_min' => 'decimal:2',
        'salary_max' => 'decimal:2',
        'published_at' => 'datetime',
        'expires_at' => 'datetime',
    ];

    protected $appends = ['is_saved', 'has_applied', 'application_status', 'application_created_at'];

    public function getIsSavedAttribute(): bool
    {
        $user = Auth::user();

        if (! $user) {
            return false;
        }

        return $user->savedOpenings()->where('opening_id', $this->id)->exists();
    }

    public function getHasAppliedAttribute(): bool
    {
        $user = Auth::user();

        if (! $user) {
            return false;
        }

        return $this->applications()->where('user_id', $user->id)->exists();
    }

    public function getApplicationStatusAttribute(): ?string
    {
        $user = Auth::user();

        if (! $user) {
            return null;
        }

        $application = $this->applications()->where('user_id', $user->id)->first();

        return $application?->status;
    }

    public function getApplicationCreatedAtAttribute(): ?Carbon
    {
        $user = Auth::user();

        if (! $user) {
            return null;
        }

        $application = $this->applications()->where('user_id', $user->id)->first();

        return $application?->created_at;
    }

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function skills(): BelongsToMany
    {
        return $this->belongsToMany(Skill::class, 'opening_skills', 'opening_id', 'skill_id')
            ->withTimestamps();
    }

    public function address(): MorphOne
    {
        return $this->morphOne(Address::class, 'addressable');
    }

    public function industry(): BelongsTo
    {
        return $this->belongsTo(Industry::class);
    }

    public function savedByUsers(): HasMany
    {
        return $this->hasMany(SavedOpening::class);
    }

    public function applications(): HasMany
    {
        return $this->hasMany(OpeningApplication::class);
    }

    public function shortlists(): HasMany
    {
        return $this->hasMany(Shortlist::class);
    }

    public function shortlistedCandidates(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'shortlists', 'opening_id', 'user_id')->withTimestamps();
    }
}
