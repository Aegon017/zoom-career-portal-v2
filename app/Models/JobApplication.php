<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class JobApplication extends Model
{
    protected $fillable = ['jobseeker_id', 'job_posting_id', 'status'];

    public function jobseeker(): BelongsTo
    {
        return $this->belongsTo(JobSeeker::class);
    }

    public function jobPosting(): BelongsTo
    {
        return $this->belongsTo(JobPosting::class);
    }
}
