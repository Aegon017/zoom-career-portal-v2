<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

final class CareerInterestIndustry extends Model
{
    protected $fillable = ['career_interest_id', 'industry_id'];

    public function careerInterest()
    {
        return $this->belongsTo(CareerInterest::class);
    }

    public function industry()
    {
        return $this->belongsTo(Industry::class);
    }
}
