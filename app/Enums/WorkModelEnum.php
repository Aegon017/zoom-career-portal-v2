<?php

namespace App\Enums;

use App\Traits\EnumHelpers;

enum WorkModelEnum: string
{
    use EnumHelpers;

    case Remote = 'remote';
    case OnSite = 'on-site';
    case Hybrid = 'hybrid';

    public function label(): string
    {
        return match ($this) {
            self::Remote => 'Remote',
            self::OnSite   => 'On-site',
            self::Hybrid   => 'Hybrid',
        };
    }
}
