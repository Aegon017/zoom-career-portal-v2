<?php

namespace App\Enums;

use App\Enums\Traits\EnumHelpers;

enum EmploymentTypeEnum: string
{
    use EnumHelpers;

    case FullTime = 'full-time';
    case PartTime = 'part-time';
    case Contract = 'contract';
    case Internship = 'internship';

    public function label(): string
    {
        return match ($this) {
            self::FullTime => 'Full-time',
            self::PartTime   => 'Part-time',
            self::Contract   => 'Contract',
            self::Internship   => 'Internship',
        };
    }
}
