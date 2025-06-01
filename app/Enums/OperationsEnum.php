<?php

namespace App\Enums;

use App\Traits\EnumHelpers;

enum OperationsEnum: string
{
    use EnumHelpers;

    case Create = 'Create';
    case Edit = 'Edit';

    public function label(): string
    {
        return match ($this) {
            self::Create => 'Save',
            self::Edit   => 'Update',
        };
    }
}
