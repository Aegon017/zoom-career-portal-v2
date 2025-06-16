<?php

declare(strict_types=1);

namespace App\Actions;

use App\Models\EmployerProfile;
use App\Models\User;

final class CreateEmployerProfileAction
{
    public function handle($data, User $user): EmployerProfile
    {
        return $user->employerProfile()->create([
            'opening_title_id' => $data['job_title_id'],
            'phone' => $data['phone'],
        ]);
    }
}
