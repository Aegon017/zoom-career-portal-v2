<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

final class Profile extends Model
{
    protected $fillable = [
        'user_id',
        'job_title',
        'experience',
        'notice_period',
        'summary',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
