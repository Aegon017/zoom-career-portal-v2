<?php

declare(strict_types=1);

namespace App\Exports;

use App\Models\Skill;
use Maatwebsite\Excel\Concerns\FromCollection;

final readonly class SkillExport implements FromCollection
{
    public function __construct(private array $fields = []) {}

    /**
     * @return \Illuminate\Support\Collection
     */
    public function collection()
    {
        $skills = Skill::with('domain')->get();

        return $skills->map(function ($skill, $index): array {
            $row = ['serial' => $index + 1];

            foreach ($this->fields as $field) {
                if ($field) {
                    $value = $this->getFieldValue($skill, $field);
                    $row[$field] = $value;
                }
            }

            return $row;
        });
    }

    public function headings(): array
    {
        $headings = ['Serial Number'];

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
            'domain.name' => 'Domain',
        ];

        return $headingMap[$fieldKey] ?? str_replace('_', ' ', ucwords((string) $fieldKey, '.'));
    }

    private function getFieldValue(Skill $skill, $fieldKey)
    {
        if (mb_strpos((string) $fieldKey, '.') !== false) {
            $parts = explode('.', (string) $fieldKey);
            $mainField = $parts[0];
            $subField = $parts[1];

            if ($mainField === 'domain') {
                return $skill->domain->{$subField} ?? null;
            }
        }

        return match ($fieldKey) {
            'name' => $skill->{$fieldKey},
            'domain' => $skill->domain->{$fieldKey} ?? null,
            default => null
        };
    }
}
