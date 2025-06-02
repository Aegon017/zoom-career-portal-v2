<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Education extends Model
{
    protected $fillable = [
        'employer_id',
        'jobseeker_id',
        'school_name',
        'graduation_year'
    ];

    protected $casts = [
        'graduation_year' => 'integer'
    ];

    public function employer(): BelongsTo
    {
        return $this->belongsTo(Employer::class);
    }

    public function jobseeker(): BelongsTo
    {
        return $this->belongsTo(Jobseeker::class);
    }
}
