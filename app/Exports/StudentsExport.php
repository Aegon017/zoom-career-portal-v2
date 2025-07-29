<?php

declare(strict_types=1);

namespace App\Exports;

use App\Models\User;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

final class StudentsExport implements FromCollection, WithHeadings
{
    /**
     * @return \Illuminate\Support\Collection
     */
    public function collection()
    {
        return User::role('jobseeker')->with('profile')->select('id', 'name', 'email', 'phone')
            ->get()
            ->map(fn($user, $index): array => [
                'serial' => $index + 1,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'status' => $user->profile?->is_verified ? 'Verified' : 'Pending',
                'source' => $user->profile?->student_id ? 'Outside' : 'Zoom',
            ]);
    }

    public function headings(): array
    {
        return ['#', 'name', 'email', 'phone', 'status', 'source'];
    }
}
