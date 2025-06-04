<?php

namespace App\Models;

use App\Enums\EmployerOnBoardingEnum;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EmployerOnBoarding extends Model
{
    protected $fillable = [
        'user_id',
        'step',
        'is_completed'
    ];

    protected $casts = [
        'is_completed' => 'boolean',
        'step' => EmployerOnBoardingEnum::class
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
