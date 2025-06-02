<?php

namespace App\Models;

use App\Enums\VerificationStatusEnum;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Employer extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'company_id',
        'profile_image',
        'job_title',
        'types_of_candidates',
        'phone',
        'verification_status'
    ];

    protected $casts = [
        'types_of_candidates' => 'array',
        'verification_status' => VerificationStatusEnum::class
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function educations(): HasMany
    {
        return $this->hasMany(Education::class);
    }

    public function jobPostings(): HasMany
    {
        return $this->hasMany(JobPosting::class);
    }
}
