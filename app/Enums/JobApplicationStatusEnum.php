<?php

declare(strict_types=1);

namespace App\Enums;

use App\Traits\EnumHelpers;

enum JobApplicationStatusEnum: string
{
    use EnumHelpers;

    case Applied = 'applied';
    case Shortlisted = 'shortlisted';
    case Hired = 'hired';

    public function label(): string
    {
        return match ($this) {
            self::Applied => 'Applied',
            self::Shortlisted => 'Shortlisted',
            self::Hired => 'Hired',
        };
    }
}
