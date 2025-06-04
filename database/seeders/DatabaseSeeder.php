<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\JobPosting;
use App\Models\Skill;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

final class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(1000)->create();
        Skill::factory(100)->create();
        // JobPosting::factory(100)->create();
    }
}
