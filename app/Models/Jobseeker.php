<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Jobseeker extends Model
{
    protected $fillable = [
        'user_id',
        'profile_image'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
