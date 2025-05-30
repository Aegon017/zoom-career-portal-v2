<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class JobPosting extends Model
{
    use HasFactory;

    protected $fillable = [
        'company_id',
        'employer_id',
        'title',
        'employment_type',
        'work_model',
        'description',
        'salary_min',
        'salary_max',
        'salary_unit',
        'currency',
        'city',
        'state',
        'country',
        'published_at',
        'expires_at',
        'status',
        'verification_status',
    ];

    protected $casts = [
        'salary_min' => 'decimal:2',
        'salary_max' => 'decimal:2',
        'published_at' => 'datetime',
        'expires_at' => 'datetime',
    ];

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function employer(): BelongsTo
    {
        return $this->belongsTo(Employer::class);
    }

    public function skills(): BelongsToMany
    {
        return $this->belongsToMany(Skill::class);
    }
}
