<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

final class Chat extends Model
{
    use HasFactory;

    public function participants(): HasMany
    {
        return $this->hasMany(ChatParticipant::class)->with('user');
    }

    public function messages(): HasMany
    {
        return $this->hasMany(ChatMessage::class);
    }
}
