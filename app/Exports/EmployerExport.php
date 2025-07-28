<?php

namespace App\Exports;

use App\Models\Company;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class EmployerExport implements FromCollection, WithHeadings
{
    /**
     * @return \Illuminate\Support\Collection
     */
    public function collection()
    {
        return Company::select('name', 'email', 'phone', 'verification_status')
            ->get()
            ->map(function ($company, $index) {
                return [
                    'serial' => $index + 1,
                    'name' => $company->name,
                    'email' => $company->email,
                    'phone' => $company->phone,
                    'verification_status' => $company->verification_status,
                ];
            });
    }

    public function headings(): array
    {
        return ['#', 'name', 'email', 'phone', 'verification_status'];
    }
}
