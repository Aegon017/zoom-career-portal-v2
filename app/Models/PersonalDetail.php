<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PersonalDetail extends Model
{
    protected $fillable = [
        'user_id',
        'gender',
        'date_of_birth',
        'marital_status',
        'differently_abled',
    ];

    protected $casts = [
        'date_of_birth' => 'date',
        'differently_abled' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
