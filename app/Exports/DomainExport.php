<?php

declare(strict_types=1);

namespace App\Exports;

use App\Models\Domain;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

final readonly class DomainExport implements FromCollection, WithHeadings
{
    public function __construct(private array $fields = []) {}

    /**
     * @return \Illuminate\Support\Collection
     */
    public function collection()
    {
        $domains = Domain::get();

        return $domains->map(function ($domain, $index): array {
            $row = ['serial' => $index + 1];

            foreach ($this->fields as $field) {
                if ($field) {
                    $value = $this->getFieldValue($domain, $field);
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
            'name' => 'Name',
        ];

        return $headingMap[$fieldKey] ?? str_replace('_', ' ', ucwords((string) $fieldKey, '.'));
    }

    private function getFieldValue($domain, $fieldKey)
    {
        return match ($fieldKey) {
            'name' => $domain->{$fieldKey},
            default => null,
        };
    }
}
