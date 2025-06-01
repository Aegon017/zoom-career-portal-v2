<?php

namespace App\Traits;

trait EnumHelpers
{
    public static function options(): array
    {
        return array_map(
            fn($case) => [
                'value' => $case->value,
                'label' => method_exists($case, 'label') ? $case->label() : ucfirst($case->value)
            ],
            self::cases()
        );
    }

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
