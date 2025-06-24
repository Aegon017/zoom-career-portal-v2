<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

final class JobFunction extends Model
{
    protected $fillable = ['name', 'is_active'];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function careerInterestJobFunctions()
    {
        return $this->hasMany(CareerInterestJobFunction::class);
    }
}
