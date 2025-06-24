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
        'position_type',
        'post_grad_options',
        'how_can_we_help',
        'graduation_month',
        'graduation_year',
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
