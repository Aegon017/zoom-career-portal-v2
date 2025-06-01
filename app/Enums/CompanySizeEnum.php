<?php

namespace App\Enums;

use App\Traits\EnumHelpers;

enum CompanySizeEnum: string
{
    use EnumHelpers;

    case OneToTen = '1-10';
    case TenToFifty = '10-50';
    case FiftyToHundred = '50-100';
    case HundredToTwoFifty = '100-250';
    case TwoFiftyToThousand = '250-1000';
    case ThousandToFiveThousand = '1000-5000';
    case FiveThousandToTenThousand = '5000-10000';
    case TenThousandToTwentyFiveThousand = '10000-25000';
    case TwentyFiveThousandPlus = '25000+';
}
