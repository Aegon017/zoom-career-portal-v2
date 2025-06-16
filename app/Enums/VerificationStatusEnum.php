<?php

declare(strict_types=1);

namespace App\Enums;

use App\Traits\EnumHelpers;

enum VerificationStatusEnum: string
{
    use EnumHelpers;

    case Pending = 'pending';
    case Verified = 'verified';
    case Approved = 'approved';
    case Rejected = 'rejected';

    public function label(): string
    {
        return match ($this) {
            self::Pending => 'Pending',
            self::Verified => 'Verified',
            self::Approved => 'Approved',
            self::Rejected => 'Rejected',
        };
    }
}
