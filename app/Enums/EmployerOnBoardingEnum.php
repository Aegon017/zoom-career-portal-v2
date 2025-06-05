<?php

declare(strict_types=1);

namespace App\Enums;

enum EmployerOnBoardingEnum: int
{
    case PROFILE_SETUP = 1;
    case COMPANY_CREATE_OR_JOIN = 2;
    case COMPANY_JOIN_VERIFICATION = 3;
    case COMPANY_SETUP = 4;
    case COMPANY_SETUP_VERIFICATION = 5;

    public function label(): string
    {
        return match ($this) {
            self::PROFILE_SETUP => 'Profile Setup',
            self::COMPANY_CREATE_OR_JOIN => 'Create or Join a Company',
            self::COMPANY_JOIN_VERIFICATION => 'Company Join Verification',
            self::COMPANY_SETUP => 'Company Setup',
            self::COMPANY_SETUP_VERIFICATION => 'Company Setup Verification',
        };
    }
}
