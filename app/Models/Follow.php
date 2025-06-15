<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Follow extends Model
{
    protected $fillable = [
        'follower_id',
        'followable_id',
        'followable_type',
    ];

    public function followable()
    {
        return $this->morphTo();
    }

    public function follower()
    {
        return $this->belongsTo(User::class, 'follower_id');
    }
}
