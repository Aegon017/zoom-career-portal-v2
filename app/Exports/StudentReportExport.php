<?php

namespace App\Exports;

use App\Models\User;
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

class StudentReportExport implements FromCollection, WithHeadings, WithMapping, WithStyles, WithColumnFormatting, ShouldAutoSize
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
        $cacheKey = 'student_report_' . md5(serialize([$this->selectedFields, $this->filters]));

        return Cache::remember($cacheKey, 300, function () {
            $query = User::with([
                'openingApplications' => function ($query) {
                    $query->with(['opening.company'])
                        ->orderBy('created_at', 'desc');
                }
            ])->role('jobseeker');

            if (!empty($this->filters['search'])) {
                $searchTerm = $this->filters['search'];
                $query->where(function ($q) use ($searchTerm) {
                    $q->where('name', 'like', "%{$searchTerm}%")
                        ->orWhere('email', 'like', "%{$searchTerm}%")
                        ->orWhere('phone', 'like', "%{$searchTerm}%");
                });
            }

            if (!empty($this->filters['start_date'])) {
                $query->whereDate('created_at', '>=', $this->filters['start_date']);
            }

            if (!empty($this->filters['end_date'])) {
                $query->whereDate('created_at', '<=', $this->filters['end_date']);
            }

            return $query->get()->map(function ($user) {
                $user->total_applied = $user->openingApplications->count();
                $user->total_shortlisted = $user->openingApplications
                    ->where('status', 'shortlisted')->count();
                $user->total_hired = $user->openingApplications
                    ->where('status', 'hired')->count();

                return $user;
            });
        });
    }

    public function headings(): array
    {
        $headings = [];
        $fieldMap = [
            'id' => 'ID',
            'name' => 'Name',
            'email' => 'Email',
            'phone' => 'Phone',
            'total_applied' => 'Jobs Applied',
            'total_shortlisted' => 'Shortlisted',
            'total_hired' => 'Hired',
            'created_at' => 'Registration Date',
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

    public function map($student): array
    {
        $row = [];
        $applicationDetails = 'No applications found';

        if (in_array('id', $this->selectedFields)) $row[] = $student->id;
        if (in_array('name', $this->selectedFields)) $row[] = $student->name;
        if (in_array('email', $this->selectedFields)) $row[] = $student->email;
        if (in_array('phone', $this->selectedFields)) $row[] = (string) $student->phone;
        if (in_array('total_applied', $this->selectedFields)) $row[] = $student->total_applied ?? 0;
        if (in_array('total_shortlisted', $this->selectedFields)) $row[] = $student->total_shortlisted ?? 0;
        if (in_array('total_hired', $this->selectedFields)) $row[] = $student->total_hired ?? 0;

        if (in_array('created_at', $this->selectedFields)) {
            $row[] = $student->created_at ? $student->created_at->format('Y-m-d') : '';
        }

        if (in_array('updated_at', $this->selectedFields)) {
            $row[] = $student->updated_at ? $student->updated_at->format('Y-m-d') : '';
        }

        if ($student->openingApplications->isNotEmpty()) {
            $applicationDetails = '';
            foreach ($student->openingApplications as $index => $application) {
                if ($index > 0) {
                    $applicationDetails .= "\n------------------------\n";
                }

                $applicationDetails .= "Company: " . ($application->opening->company->name ?? 'N/A') . "\n";
                $applicationDetails .= "Job Title: " . ($application->opening->title ?? 'N/A') . "\n";
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