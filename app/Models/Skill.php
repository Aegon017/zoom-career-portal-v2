<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

final class Skill extends Model
{
    use HasFactory;

    protected $fillable = ['name','domain_id'];

    public function domain(): BelongsTo
    {
        return $this->belongsTo(Domain::class);
    }

    public function openings(): BelongsToMany
    {
        return $this->belongsToMany(Opening::class, 'opening_skills', 'skill_id', 'opening_id')
            ->withTimestamps();
    }

    public function skillUsers(): HasMany
    {
        return $this->hasMany(SkillUser::class);
    }

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'skill_users')->withTimestamps();
    }
}
