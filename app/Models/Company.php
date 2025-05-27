<?php

namespace App\Models;

use App\Enums\CompanySizeEnum;
use App\Enums\CompanyTypeEnum;
use App\Enums\VerificationStatusEnum;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;

class Company extends Model
{
    protected $fillable = [
        'company_name',
        'company_logo',
        'industry',
        'company_website',
        'company_description',
        'company_address',
        'public_phone',
        'public_email',
        'company_size',
        'company_type',
        'verification_status'
    ];

    protected function casts(): array
    {
        return [
            'company_size' => CompanySizeEnum::class,
            'company_type' => CompanyTypeEnum::class,
            'verification_status' => VerificationStatusEnum::class
        ];
    }

    public function employers(): HasMany
    {
        return $this->hasMany(Employer::class);
    }
}
