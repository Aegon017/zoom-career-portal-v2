<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

final class CareerInterestJobType extends Model
{
    protected $fillable = ['career_interest_id', 'job_type_id'];

    public function careerInterest()
    {
        return $this->belongsTo(CareerInterest::class);
    }

    public function jobType()
    {
        return $this->belongsTo(JobType::class);
    }
}
