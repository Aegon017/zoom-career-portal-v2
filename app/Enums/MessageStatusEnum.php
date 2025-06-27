<?php

namespace App\Enums;

use App\Traits\EnumHelpers;

enum MessageStatusEnum: string
{
    use EnumHelpers;

    case SENT = 'sent';
    case DELIVERED = 'delivered';
    case READ = 'read';
    case FAILED = 'failed';

    public function label(): string
    {
        return match ($this) {
            self::SENT => 'Sent',
            self::DELIVERED => 'Delivered',
            self::READ => 'Read',
            self::FAILED => 'Failed',
        };
    }
}
