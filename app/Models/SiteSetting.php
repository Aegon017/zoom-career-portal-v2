<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

final class SiteSetting extends Model
{
    protected $fillable = ['name', 'status'];

    protected $casts = ['status' => 'boolean'];
}
