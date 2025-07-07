<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Education extends Model
{

    protected $fillable = [
        'user_id',
        'course_title',
        'institution',
        'start_date',
        'end_date',
        'is_current',
        'course_type',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'is_current' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function getDurationAttribute(): string
    {
        $start = optional($this->start_date)->format('Y');
        $end = $this->is_current ? 'Present' : optional($this->end_date)->format('Y');

        return trim("{$start} - {$end}", ' -');
    }
}
