<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

final class Profile extends Model
{
    protected $fillable = [
        'user_id',
        'job_title',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
