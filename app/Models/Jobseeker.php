<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

final class Jobseeker extends Model
{
    protected $fillable = [
        'user_id',
        'profile_image',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function educations(): HasMany
    {
        return $this->hasMany(Education::class);
    }

    public function savedJobPostings(): BelongsToMany
    {
        return $this->belongsToMany(JobPosting::class)->withTimestamps();
    }

    public function jobApplications(): HasMany
    {
        return $this->hasMany(JobApplication::class);
    }

    public function appliedJobs(): BelongsToMany
    {
        return $this->belongsToMany(JobPosting::class, 'job_applications')
            ->withPivot('status')
            ->withTimestamps();
    }
}
