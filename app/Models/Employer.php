<?php

namespace App\Models;

use App\Enums\VerificationStatusEnum;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Employer extends Model
{
    protected $fillable = [
        'user_id',
        'company_id',
        'verification_status'
    ];

    protected function casts(): array
    {
        return [
            'verification_status' => VerificationStatusEnum::class
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }
}
