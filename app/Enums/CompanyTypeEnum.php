<?php

declare(strict_types=1);

namespace App\Enums;

use App\Traits\EnumHelpers;

enum CompanyTypeEnum: string
{
    use EnumHelpers;

    case Public = 'public';
    case Private = 'private';
    case Government = 'government';

    public function label(): string
    {
        return match ($this) {
            self::Public => 'Public',
            self::Private => 'Private',
            self::Government => 'Government',
        };
    }
}
