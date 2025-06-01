<?php

namespace App\Enums;

use App\Traits\EnumHelpers;

enum SalaryUnitEnum: string
{
    use EnumHelpers;

    case Hourly = 'hourly';
    case Monthly = 'monthly';
    case Yearly = 'yearly';
}
