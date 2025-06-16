<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Jobseeker;
use App\Models\Opening;
use Illuminate\Database\Seeder;

final class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(1000)->create();
        // Skill::factory(100)->create();
        // Company::factory(100)->create();
        // Opening::factory(10)->create();
        Jobseeker::factory(10);
    }
}
