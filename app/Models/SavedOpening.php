<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

final class SavedOpening extends Model
{
    protected $fillable = ['user_id', 'opening_id'];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function opening(): BelongsTo
    {
        return $this->belongsTo(Opening::class);
    }
}
