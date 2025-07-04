<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

final class CareerInterestIndustry extends Model
{
    protected $fillable = ['career_interest_id', 'industry_id'];

    public function careerInterest(): BelongsTo
    {
        return $this->belongsTo(CareerInterest::class);
    }

    public function industry(): BelongsTo
    {
        return $this->belongsTo(Industry::class);
    }
}
