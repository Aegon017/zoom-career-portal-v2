<?php

declare(strict_types=1);

namespace App\Enums;

use App\Traits\EnumHelpers;

enum ProficiencyEnum: string
{
    use EnumHelpers;

    case Beginner = 'beginner';
    case Intermediate = 'intermediate';
    case Proficient = 'proficient';
    case Fluent = 'fluent';
    case Native = 'native';

    public function label(): string
    {
        return match ($this) {
            self::Beginner => 'Beginner',
            self::Intermediate => 'Intermediate',
            self::Proficient => 'Proficient',
            self::Fluent => 'Fluent',
            self::Native => 'Native',
        };
    }
}
