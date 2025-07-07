<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Language extends Model
{
    protected $fillable = ['name', 'code'];

    public function userLanguages(): HasMany
    {
        return $this->hasMany(UserLanguage::class);
    }
}
