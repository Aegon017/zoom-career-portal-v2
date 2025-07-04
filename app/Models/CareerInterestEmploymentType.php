<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\EmploymentTypeEnum;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

final class CareerInterestEmploymentType extends Model
{
    protected $fillable = ['career_interest_id', 'employment_type'];

    protected $casts = [
        'employment_type' => EmploymentTypeEnum::class,
    ];

    public function careerInterest(): BelongsTo
    {
        return $this->belongsTo(CareerInterest::class);
    }
}
