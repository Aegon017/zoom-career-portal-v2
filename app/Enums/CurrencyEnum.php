<?php

namespace App\Enums;

use App\Enums\Traits\EnumHelpers;

enum CurrencyEnum: string
{

    use EnumHelpers;

    case USD = 'USD';
    case EUR = 'EUR';
    case INR = 'INR';
}
