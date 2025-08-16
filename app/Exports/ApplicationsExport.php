<?php

namespace App\Exports;

use App\Models\Opening;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class ApplicationsExport implements FromCollection, WithHeadings, WithMapping, ShouldAutoSize, WithStyles
{
    protected $job;
    protected $jobTitle;

    public function __construct(Opening $job)
    {
        $this->job = $job;
        $this->jobTitle = $job->title;
    }

    public function collection()
    {
        return $this->job->applications()
            ->with(['user:id,name,email'])
            ->get([
                'id',
                'user_id',
                'status',
                'match_score',
                'created_at'
            ]);
    }

    public function headings(): array
    {
        return [
            'ID',
            'Job Title',
            'Candidate',
            'Email',
            'Status',
            'Match Score',
            'Applied At',
        ];
    }

    public function map($application): array
    {
        return [
            $application->id,
            $this->jobTitle,
            $application->user->name,
            $application->user->email,
            ucfirst($application->status),
            $application->match_score ? round($application->match_score, 2) : 'N/A',
            $application->created_at->format('M d, Y H:i'),
        ];
    }

    public function styles(Worksheet $sheet)
    {
        return [
            1 => ['font' => ['bold' => true]],
            'A1:G' . ($sheet->getHighestRow()) => [
                'borders' => [
                    'allBorders' => [
                        'borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN,
                    ],
                ],
            ],
        ];
    }
}
