<?php

namespace App\Enums;

enum OperationsEnum: string
{
    case Create = 'Create';
    case Edit = 'Edit';

    public function label(): string
    {
        return match ($this) {
            self::Create => 'Save',
            self::Edit   => 'Update',
        };
    }
}
