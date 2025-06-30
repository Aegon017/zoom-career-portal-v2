<?php

<<<<<<< HEAD
=======
declare(strict_types=1);

>>>>>>> v3
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

<<<<<<< HEAD
class CompanyUser extends Model
=======
final class CompanyUser extends Model
>>>>>>> v3
{
    protected $fillable = [
        'company_id',
        'user_id',
        'verified_at',
<<<<<<< HEAD
        'status',
=======
        'verification_status',
>>>>>>> v3
        'role',
    ];

    protected $casts = [
        'verified_at' => 'datetime',
    ];

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
