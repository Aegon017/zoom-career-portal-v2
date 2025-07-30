<?php

declare(strict_types=1);

namespace App\Exports;

use App\Models\Company;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

final class EmployerExport implements FromCollection, WithHeadings
{
    /**
     * @return \Illuminate\Support\Collection
     */
    public function collection()
    {
        return Company::select('name', 'email', 'phone', 'verification_status')
            ->get()
            ->map(fn($company, $index): array => [
                'serial' => $index + 1,
                'name' => $company->name,
                'email' => $company->email,
                'phone' => $company->phone,
                'verification_status' => $company->verification_status->value,
            ]);
    }

    public function headings(): array
    {
        return ['#', 'name', 'email', 'phone', 'verification_status'];
    }
}
