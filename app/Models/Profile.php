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
        'course_completed',
        'student_id',
        'completed_month',
        'do_not_remember',
        'is_verified',
    ];

    protected $casts = [
        'do_not_remember' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
