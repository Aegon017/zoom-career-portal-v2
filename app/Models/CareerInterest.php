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
        'graduation_month',
        'graduation_year',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function employmentTypes(): HasMany
    {
        return $this->hasMany(CareerInterestEmploymentType::class);
    }

    public function jobTitles(): HasMany
    {
        return $this->hasMany(CareerInterestJobTitle::class);
    }

    public function industries(): HasMany
    {
        return $this->hasMany(CareerInterestIndustry::class);
    }

    public function locations(): HasMany
    {
        return $this->hasMany(CareerInterestLocation::class);
    }
}
