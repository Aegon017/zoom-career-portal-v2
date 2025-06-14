<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class OpeningTitle extends Model
{
    protected $fillable = [
        'name'
    ];

    public function employerProfiles(): HasMany
    {
        return $this->hasMany(EmployerProfile::class);
    }
}
