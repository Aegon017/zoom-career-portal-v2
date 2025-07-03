<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CareerInterestJobTitle extends Model
{
    protected $fillable = ['career_interest_id', 'opening_title_id'];

    public function careerInterest(): BelongsTo
    {
        return $this->belongsTo(CareerInterest::class);
    }

    public function openingTitle(): BelongsTo
    {
        return $this->belongsTo(OpeningTitle::class);
    }
}
