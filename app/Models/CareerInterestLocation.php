<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

final class CareerInterestLocation extends Model
{
    protected $fillable = ['career_interest_id', 'location_id'];

    public function careerInterest(): BelongsTo
    {
        return $this->belongsTo(CareerInterest::class);
    }

    public function location(): BelongsTo
    {
        return $this->belongsTo(Location::class);
    }
}
