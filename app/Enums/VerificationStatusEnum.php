<?php

namespace App\Enums;

use App\Traits\EnumHelpers;

enum VerificationStatusEnum: string
{
    use EnumHelpers;

    case Pending = 'pending';
    case Approved = 'approved';
    case Rejected = 'rejected';

    public function label(): string
    {
        return match ($this) {
            self::Pending => 'Pending',
            self::Approved => 'Approved',
            self::Rejected => 'Rejected',
        };
    }
}
