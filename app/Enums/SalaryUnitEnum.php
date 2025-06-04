<?php

declare(strict_types=1);

namespace App\Enums;

use App\Traits\EnumHelpers;

enum SalaryUnitEnum: string
{
    use EnumHelpers;

    case Hourly = 'hourly';
    case Monthly = 'monthly';
    case Yearly = 'yearly';
}
