<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Maatwebsite\Excel\Facades\Excel;
use App\Imports\LocationsImport;

class ImportLocationsFromExcel extends Command
{
    protected $signature = 'locations:import';
    protected $description = 'Import locations from an Excel (.xlsx) file';

    public function handle()
    {
        $filePath = storage_path('app/locations/worldcities.xlsx');

        if (!file_exists($filePath)) {
            $this->error("❌ File not found: $filePath");
            return 1;
        }

        $this->info("📥 Importing locations from Excel...");
        Excel::import(new LocationsImport, $filePath);
        $this->info("✅ Locations imported successfully!");

        return 0;
    }
}
