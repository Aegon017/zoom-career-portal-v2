<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

final class ChatParticipant extends Model
{
    protected $fillable = ['chat_id', 'user_id'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
