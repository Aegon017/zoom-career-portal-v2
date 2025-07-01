<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

final class CareerInterest extends Model
{
    protected $fillable = [
        'user_id',
        'preferred_positions',
        'post_graduation_plans',
        'zoom_support_preferences',
        'desired_jobs',
        'preferred_locations',
        'target_industries',
        'job_function_interests',
        'graduation_month',
        'graduation_year',
    ];

    protected $casts = [
        'preferred_positions' => 'json',
        'post_graduation_plans' => 'json',
        'zoom_support_preferences' => 'json',
        'desired_jobs' => 'json',
        'preferred_locations' => 'json',
        'target_industries' => 'json',
        'job_function_interests' => 'json',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function industries(): HasMany
    {
        return $this->hasMany(CareerInterestIndustry::class);
    }

    public function jobTypes(): HasMany
    {
        return $this->hasMany(CareerInterestJobType::class);
    }

    public function jobFunctions(): HasMany
    {
        return $this->hasMany(CareerInterestJobFunction::class);
    }

    public function locations(): HasMany
    {
        return $this->hasMany(CareerInterestLocation::class);
    }
}
