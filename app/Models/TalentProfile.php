<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

final class TalentProfile extends Model
{
    protected $fillable = [
        'name',
    ];

    public function employerProfiles(): BelongsToMany
    {
        return $this->belongsToMany(EmployerProfile::class);
    }
}
