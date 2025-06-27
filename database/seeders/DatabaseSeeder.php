<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Chat;
use App\Models\ChatUser;
use App\Models\Inbox;
use App\Models\Jobseeker;
use App\Models\Message;
use App\Models\Opening;
use App\Models\User;
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
        Chat::factory(10)->create()->each(function ($chat) {
            $participants = User::inRandomOrder()->take(2)->get();

            foreach ($participants as $user) {
                ChatUser::factory()->create([
                    'chat_id' => $chat->id,
                    'user_id' => $user->id,
                ]);
            }

            foreach (range(1, 5) as $i) {
                Message::factory()->create([
                    'chat_id' => $chat->id,
                    'user_id' => $participants->random()->id,
                ]);
            }
        });
    }
}
