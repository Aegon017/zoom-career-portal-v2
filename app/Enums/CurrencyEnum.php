<?php

declare(strict_types=1);

namespace App\Enums;

use App\Traits\EnumHelpers;

enum CurrencyEnum: string
{
    use EnumHelpers;

    case USD = 'USD';
    case EUR = 'EUR';
    case INR = 'INR';
}
