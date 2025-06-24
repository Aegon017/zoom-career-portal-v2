<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CareerInterestJobType extends Model
{
    protected $fillable = ['career_interest_id', 'job_type_id'];

    public function careerInterest(): BelongsTo
    {
        return $this->belongsTo(CareerInterest::class);
    }

    public function jobType(): BelongsTo
    {
        return $this->belongsTo(JobType::class);
    }
}
