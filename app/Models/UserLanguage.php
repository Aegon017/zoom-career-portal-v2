<?php

namespace App\Models;

use App\Enums\ProficiencyEnum;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserLanguage extends Model
{
    protected $fillable = [
        'user_id',
        'language_id',
        'proficiency',
        'can_read',
        'can_write',
        'can_speak',
    ];

    protected $casts = [
        'proficiency' => ProficiencyEnum::class,
        'can_read' => 'boolean',
        'can_write' => 'boolean',
        'can_speak' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function language(): BelongsTo
    {
        return $this->belongsTo(Language::class);
    }
}
