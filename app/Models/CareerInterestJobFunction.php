<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

final class CareerInterestJobFunction extends Model
{
    protected $fillable = ['career_interest_id', 'job_function_id'];

    public function careerInterest()
    {
        return $this->belongsTo(CareerInterest::class);
    }

    public function jobFunction()
    {
        return $this->belongsTo(JobFunction::class);
    }
}
