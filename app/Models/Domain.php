<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

final class Domain extends Model
{
    protected $fillable = ['name'];

    public function skills(): HasMany
    {
        return $this->hasMany(Skill::class);
    }
}
