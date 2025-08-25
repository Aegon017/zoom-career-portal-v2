<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

final class Feedback extends Model
{
    protected $fillable = [
        'user_id',
        'opening_id',
        'feedback',
        'hired_details',
        'selected_candidates',
        'additional_comments',
    ];

    protected $casts = [
        'selected_candidates' => 'array',
    ];

    public function opening(): BelongsTo
    {
        return $this->belongsTo(Opening::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
