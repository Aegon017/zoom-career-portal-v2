<?php

declare(strict_types=1);

namespace App\Imports;

use App\Models\Location;
use Illuminate\Support\Str;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithBatchInserts;
use Maatwebsite\Excel\Concerns\WithChunkReading;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

final class LocationsImport implements ToModel, WithBatchInserts, WithChunkReading, WithHeadingRow
{
    public function model(array $row)
    {
        return new Location([
            'city' => $this->normalize($row['city']),
            'state' => $this->normalize($row['admin_name']),
            'country' => $this->normalize($row['country']),
        ]);
    }

    public function chunkSize(): int
    {
        return 500;
    }

    public function batchSize(): int
    {
        return 500;
    }

    private function normalize($string)
    {
        if (! $string) {
            return null;
        }

        $map = [
            'ō' => 'o',
            'Ō' => 'O',
            'ū' => 'u',
            'Ū' => 'U',
            'ā' => 'a',
            'Ā' => 'A',
            'ē' => 'e',
            'Ē' => 'E',
            'ī' => 'i',
            'Ī' => 'I',
            'ñ' => 'n',
            'Ñ' => 'N',
        ];

        $plain = strtr($string, $map);

        return Str::title(mb_strtolower(mb_trim($plain)));
    }
}
