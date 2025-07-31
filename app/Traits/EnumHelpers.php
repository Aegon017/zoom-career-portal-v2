<?php

declare(strict_types=1);

namespace App\Traits;

trait EnumHelpers
{
    public static function options(): array
    {
        return array_map(
            fn($case): array => [
                'value' => $case->value,
                'label' => method_exists($case, 'label') ? $case->label() : ucfirst((string) $case->value),
            ],
            self::cases()
        );
    }

    public function option(): array
    {
        return [
            'value' => $this->value,
            'label' => $this->label(),
        ];
    }

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
