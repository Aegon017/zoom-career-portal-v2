<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

final class OpeningSkill extends Model
{
    protected $fillable = [
        'opening_id',
        'skill_id',
    ];

    public function opening(): BelongsTo
    {
        return $this->belongsTo(Opening::class);
    }

    public function skill(): BelongsTo
    {
        return $this->belongsTo(Skill::class);
    }
}
