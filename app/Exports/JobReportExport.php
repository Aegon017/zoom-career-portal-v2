<?php

namespace App\Exports;

use App\Models\Opening;
use Maatwebsite\Excel\Concerns\{
    FromCollection,
    WithHeadings,
    WithMapping,
    WithStyles,
    WithColumnFormatting,
    ShouldAutoSize
};
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Style\NumberFormat;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use Illuminate\Support\Facades\Cache;

class JobReportExport implements FromCollection, WithHeadings, WithMapping, WithStyles, WithColumnFormatting, ShouldAutoSize
{
    private $selectedFields;
    private $filters;

    public function __construct(array $selectedFields = [], array $filters = [])
    {
        $this->selectedFields = $selectedFields;
        $this->filters = $filters;
    }

    public function collection()
    {
        $cacheKey = 'job_report_' . md5(serialize([$this->selectedFields, $this->filters]));

        return Cache::remember($cacheKey, 300, function () {
            $query = Opening::with([
                'company',
                'applications.user' => function ($query) {
                    $query->select('id', 'name', 'email', 'phone');
                }
            ]);

            if (!empty($this->filters['search'])) {
                $searchTerm = $this->filters['search'];
                $query->where(function ($q) use ($searchTerm) {
                    $q->where('title', 'like', "%{$searchTerm}%")
                        ->orWhereHas('company', function ($q) use ($searchTerm) {
                            $q->where('name', 'like', "%{$searchTerm}%");
                        });
                });
            }

            if (!empty($this->filters['start_date'])) {
                $query->whereDate('created_at', '>=', $this->filters['start_date']);
            }

            if (!empty($this->filters['end_date'])) {
                $query->whereDate('created_at', '<=', $this->filters['end_date']);
            }

            return $query->get()->map(function ($opening) {
                $opening->total_applied = $opening->applications->count();
                $opening->total_shortlisted = $opening->applications
                    ->where('status', 'shortlisted')->count();
                $opening->total_hired = $opening->applications
                    ->where('status', 'hired')->count();

                return $opening;
            });
        });
    }

    public function headings(): array
    {
        $headings = [];
        $fieldMap = [
            'id' => 'ID',
            'title' => 'Title',
            'company' => 'Company',
            'total_applied' => 'Students Applied',
            'total_shortlisted' => 'Shortlisted',
            'total_hired' => 'Hired',
            'created_at' => 'Created Date',
            'updated_at' => 'Last Updated'
        ];

        foreach ($this->selectedFields as $field) {
            if (isset($fieldMap[$field])) {
                $headings[] = $fieldMap[$field];
            }
        }

        if (!empty($this->selectedFields)) {
            $headings[] = 'Application Details';
        }

        return $headings;
    }

    public function map($opening): array
    {
        $row = [];
        $applicationDetails = 'No applications found';

        if (in_array('id', $this->selectedFields)) $row[] = $opening->id;
        if (in_array('title', $this->selectedFields)) $row[] = $opening->title;
        if (in_array('company', $this->selectedFields)) $row[] = $opening->company->name ?? 'N/A';
        if (in_array('total_applied', $this->selectedFields)) $row[] = $opening->total_applied ?? 0;
        if (in_array('total_shortlisted', $this->selectedFields)) $row[] = $opening->total_shortlisted ?? 0;
        if (in_array('total_hired', $this->selectedFields)) $row[] = $opening->total_hired ?? 0;

        if (in_array('created_at', $this->selectedFields)) {
            $row[] = $opening->created_at ? $opening->created_at->format('Y-m-d') : '';
        }

        if (in_array('updated_at', $this->selectedFields)) {
            $row[] = $opening->updated_at ? $opening->updated_at->format('Y-m-d') : '';
        }

        if ($opening->applications->isNotEmpty()) {
            $applicationDetails = '';
            foreach ($opening->applications as $index => $application) {
                if ($index > 0) {
                    $applicationDetails .= "\n------------------------\n";
                }

                $applicationDetails .= "Student: " . ($application->user->name ?? 'N/A') . "\n";
                $applicationDetails .= "Email: " . ($application->user->email ?? 'N/A') . "\n";
                $applicationDetails .= "Contact: " . ($application->user->phone ?? 'N/A') . "\n";
                $applicationDetails .= "Status: " . ucfirst($application->status) . "\n";
                $applicationDetails .= "Applied Date: " . $application->created_at->format('Y-m-d');
            }
        }

        $row[] = $applicationDetails;

        return $row;
    }

    public function styles(Worksheet $sheet)
    {
        $styles = [
            1 => [
                'font' => ['bold' => true],
                'alignment' => ['vertical' => Alignment::VERTICAL_CENTER]
            ],
        ];

        $lastColumn = $sheet->getHighestColumn();
        $sheet->getStyle('A1:' . $lastColumn . $sheet->getHighestRow())
            ->getAlignment()
            ->setWrapText(true)
            ->setVertical(Alignment::VERTICAL_TOP);

        $appDetailsColIndex = count($this->selectedFields) + 1;
        if ($appDetailsColIndex > 0) {
            $sheet->getColumnDimensionByColumn($appDetailsColIndex)->setWidth(50);
        }

        return $styles;
    }

    public function columnFormats(): array
    {
        $formats = [];
        $columnIndex = 1;

        foreach ($this->selectedFields as $field) {
            if ($field === 'phone') {
                $columnLetter = $this->getColumnLetter($columnIndex);
                $formats[$columnLetter] = NumberFormat::FORMAT_TEXT;
            }
            $columnIndex++;
        }

        return $formats;
    }

    private function getColumnLetter(int $columnIndex): string
    {
        $letter = '';
        while ($columnIndex > 0) {
            $temp = ($columnIndex - 1) % 26;
            $letter = chr($temp + 65) . $letter;
            $columnIndex = ($columnIndex - $temp - 1) / 26;
        }
        return $letter;
    }
}