<?php

namespace Database\Seeders;

use App\Models\Opening;
use App\Models\OpeningUserMatch;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class OpeningUserMatchSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $jobseekers = User::Role('jobseeker')->pluck('id');
        $openings   = Opening::pluck('id');

        foreach ($openings as $openingId) {
            foreach ($jobseekers as $userId) {
                OpeningUserMatch::firstOrCreate([
                    'opening_id' => $openingId,
                    'user_id'    => $userId,
                ], [
                    'match_score' => null,
                    'match_summary'     => null,
                    'is_calculated' => false
                ]);
            }
        }
    }
}
