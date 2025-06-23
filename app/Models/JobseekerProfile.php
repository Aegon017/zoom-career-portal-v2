<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

final class JobseekerProfile extends Model
{
    protected $fillable = [
        'user_id',
        'location',
        'experience',
        'notice_period',
        'summary',
        'gender',
        'date_of_birth',
        'address',
        'marital_status',
        'work_permit',
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
