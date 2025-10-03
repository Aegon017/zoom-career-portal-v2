<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OpeningUserMatch extends Model
{
    protected $fillable = [
        'opening_id',
        'user_id',
        'match_score',
        'match_summary',
        'is_calculated'
    ];

    protected $casts = [
        'is_calculated' => 'boolean'
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
