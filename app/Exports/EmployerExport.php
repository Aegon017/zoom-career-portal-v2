<?php

declare(strict_types=1);

namespace App\Exports;

use App\Models\Company;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

final class EmployerExport implements FromCollection, WithHeadings
{
    public function __construct(private array $fields = []) {}

    public function collection()
    {
        $companies = Company::get();

        return $companies->map(function ($company, $index): array {
            $row = ['serial' => $index + 1];

            foreach ($this->fields as $field) {
                if ($field) {
                    $row[$field] = $this->getFieldValue($company, $field);
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

    private function getFieldHeading(string $fieldKey): string
    {
        $headingMap = [
            'name' => 'Name',
            'email' => 'Email',
            'phone' => 'Phone',
            'industry_id' => 'Industry',
            'website_url' => 'Website',
            'size' => 'Company Size',
            'type' => 'Company Type',
            'verification_status' => 'Verification Status',
            'match_score_cutoff' => 'Match Score Cutoff',
        ];

        return $headingMap[$fieldKey] ?? str_replace('_', ' ', ucwords($fieldKey));
    }

    private function getFieldValue($company, string $fieldKey)
    {
        return match ($fieldKey) {
            'name', 'email', 'phone', 'website_url', 'match_score_cutoff' => $company->{$fieldKey},
            'industry_id' => $company->industry?->name,
            'size' => $company->size?->value ?? $company->size,
            'type' => $company->type?->value ?? $company->type,
            'verification_status' => $company->verification_status?->value ?? $company->verification_status,
            default => null,
        };
    }
}