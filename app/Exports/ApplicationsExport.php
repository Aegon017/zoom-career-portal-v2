<?php

declare(strict_types=1);

namespace App\Exports;

use App\Models\Opening;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

final class ApplicationsExport implements FromQuery, WithHeadings, WithMapping, WithStyles, ShouldAutoSize
{
    public function __construct(
        private readonly Opening $job,
        private readonly ?string $status = null
    ) {}

    public function query()
    {
        $query = $this->job->applications()->with('user:id,name,email,phone');

        if ($this->status) {
            $query->where('status', $this->status);
        }

        return $query;
    }

    public function headings(): array
    {
        return [
            'ID',
            'Job Title',
            'Candidate',
            'Email',
            'Phone',
            'Status',
            'Match Score',
            'Match Summary',
            'Applied At',
        ];
    }

    public function map($application): array
    {
        return [
            $application->id,
            $this->job->title,
            $application->user->name,
            $application->user->email,
            $application->user->phone,
            ucfirst((string) $application->status),
            $application->match_score ?? 0,
            $application->match_summary,
            $application->created_at->format('M d, Y H:i'),
        ];
    }

    public function styles(Worksheet $sheet)
    {
        $lastRow = $sheet->getHighestRow();

        return [
            1 => ['font' => ['bold' => true]],
            "A1:I{$lastRow}" => [
                'borders' => [
                    'allBorders' => [
                        'borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN,
                    ],
                ],
            ],
        ];
    }
}