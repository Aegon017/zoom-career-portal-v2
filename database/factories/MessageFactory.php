<?php

namespace Database\Factories;

use App\Enums\MessageStatusEnum;
use App\Models\Chat;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Message>
 */
class MessageFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'chat_id' => Chat::factory(),
            'user_id' => User::factory(),
            'message' => $this->faker->sentence(),
            'status' => $this->faker->randomElement(MessageStatusEnum::values()),
            'sent_at' => now(),
            'created_at' => now(),
            'updated_at' => now()
        ];
    }
}
