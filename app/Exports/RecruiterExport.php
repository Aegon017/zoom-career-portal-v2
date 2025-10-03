<?php

declare(strict_types=1);

namespace App\Exports;

use App\Models\User;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

final readonly class RecruiterExport implements FromCollection, WithHeadings
{
    public function __construct(private array $fields = []) {}

    /**
     * @return \Illuminate\Support\Collection
     */
    public function collection()
    {
        $users = User::Role('employer')->get();

        return $users->map(function ($user, $index): array {
            $row = ['serial' => $index + 1];

            foreach ($this->fields as $field) {
                if ($field) {
                    $value = $this->getFieldValue($user, $field);
                    $row[$field] = $value;
                }
            }

            return $row;
        });
    }

    public function headings(): array
    {
        $headings = ['S.No.'];

        foreach ($this->fields as $field) {
            if ($field) {
                $headings[] = $this->getFieldHeading($field);
            }
        }

        return $headings;
    }

    private function getFieldHeading($fieldKey): string|array
    {
        $headingMap = [
            'name' => 'Full Name',
            'email' => 'Email',
            'phone' => 'Phone',
        ];

        return $headingMap[$fieldKey] ?? str_replace('_', ' ', ucwords((string) $fieldKey, '.'));
    }

    private function getFieldValue($user, $fieldKey)
    {
        if (mb_strpos((string) $fieldKey, '.') !== false) {
            $parts = explode('.', (string) $fieldKey);
        }

        return match ($fieldKey) {
            'name', 'email', 'phone' => $user->{$fieldKey},
            default => null,
        };
    }
}
