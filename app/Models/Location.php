<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

final class Location extends Model
{
    protected $fillable = ['country', 'state', 'city'];

    protected $appends = ['full_name'];

    public function careerInterestLocations()
    {
        return $this->hasMany(CareerInterestLocation::class);
    }

    public function getFullNameAttribute(): string
    {
        $parts = array_filter([$this->city, $this->state, $this->country]);

        return implode(', ', $parts);
    }
}
