<?php

namespace App\Enums;

use App\Enums\Traits\EnumHelpers;

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
