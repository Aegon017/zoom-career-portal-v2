<?php

declare(strict_types=1);

namespace App\Actions;

use App\Models\Company;

final class CreateCompanyAction
{
    public function handle(array $data, string $verification_status): Company
    {
        $data['verification_status'] = $verification_status;
        $data['match_score_cutoff'] = 50;

        return Company::create($data);
    }
}
