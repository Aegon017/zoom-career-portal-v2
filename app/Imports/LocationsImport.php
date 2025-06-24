<?php

namespace App\Imports;

use App\Models\Location;
use Illuminate\Support\Str;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithChunkReading;
use Maatwebsite\Excel\Concerns\WithBatchInserts;

class LocationsImport implements ToModel, WithHeadingRow, WithChunkReading, WithBatchInserts
{
    public function model(array $row)
    {
        return new Location([
            'city'    => $this->normalize($row['city']),
            'state'   => $this->normalize($row['admin_name']),
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
        if (!$string) return null;

        $plain = iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE', $string);
        return \Illuminate\Support\Str::title(strtolower(trim($plain)));
    }
}
