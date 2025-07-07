<?php

namespace App\Enums;

use App\Traits\EnumHelpers;

enum ProficiencyEnum: string
{
    use EnumHelpers;

    case Beginner = 'Beginner';
    case Intermediate = 'Intermediate';
    case Proficient = 'Proficient';
    case Fluent = 'Fluent';
    case Native = 'Native';

    public function label(): string
    {
        return match ($this) {
            self::Beginner => 'Beginner',
            self::Intermediate => 'Intermediate',
            self::Proficient => 'Proficient',
            self::Fluent => 'Fluent',
            self::Native => 'Native'
        };
    }
}
