<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

final class Skill extends Model
{
    use HasFactory;

    protected $fillable = ['name'];

    public function opening(): BelongsToMany
    {
        return $this->belongsToMany(Opening::class);
    }
}
