<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

final class Industry extends Model
{
    protected $fillable = ['name', 'is_active'];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function companies(): HasMany
    {
        return $this->hasMany(Company::class);
    }

    public function careerInterestIndustries(): HasMany
    {
        return $this->hasMany(CareerInterestIndustry::class);
    }

    public function jobs(): HasMany
    {
        return $this->hasMany(Opening::class);
    }
}
