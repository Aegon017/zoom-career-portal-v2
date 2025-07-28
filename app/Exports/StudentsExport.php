<?php

namespace App\Exports;

use App\Models\User;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class StudentsExport implements FromCollection, WithHeadings
{
    /**
     * @return \Illuminate\Support\Collection
     */
    public function collection()
    {
        return User::role('jobseeker')->with('profile')->select('id', 'name', 'email', 'phone')
            ->get()
            ->map(function ($user, $index) {
                return [
                    'serial' => $index + 1,
                    'name' => $user->name,
                    'email' => $user->email,
                    'phone' => $user->phone,
                    'status' => $user->profile?->is_verified ? 'Verified' : 'Pending',
                    'source' => $user->profile?->student_id ? 'Outside' : 'Zoom',
                ];
            });
    }

    public function headings(): array
    {
        return ['#', 'name', 'email', 'phone', 'status', 'source'];
    }
}
