<?php

declare(strict_types=1);

namespace App\Imports;

use App\Models\Domain;
use Illuminate\Validation\Rule;
use Maatwebsite\Excel\Concerns\SkipsFailures;
use Maatwebsite\Excel\Concerns\SkipsOnFailure;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithChunkReading;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;

final class DomainImport implements SkipsOnFailure, ToModel, WithChunkReading, WithHeadingRow, WithValidation
{
    use SkipsFailures;

    /**
     * @return \Illuminate\Database\Eloquent\Model|null
     */
    public function model(array $row)
    {
        return new Domain([
            'name' => $row['name'],
        ]);
    }

    public function chunkSize(): int
    {
        return 50;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', Rule::unique('domains', 'name')],
        ];
    }
}