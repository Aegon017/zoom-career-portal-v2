<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Imports\LocationsImport;
use Illuminate\Console\Command;
use Maatwebsite\Excel\Facades\Excel;

final class ImportLocationsFromExcel extends Command
{
    protected $signature = 'locations:import';

    protected $description = 'Import locations from an Excel (.xlsx) file';

    public function handle(): int
    {
        $filePath = storage_path('app/locations/worldcities.xlsx');

        if (! file_exists($filePath)) {
            $this->error('❌ File not found: ' . $filePath);

            return 1;
        }

        $this->info('📥 Importing locations from Excel...');
        Excel::import(new LocationsImport, $filePath);
        $this->info('✅ Locations imported successfully!');

        return 0;
    }
}
