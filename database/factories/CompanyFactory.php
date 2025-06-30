<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Enums\CompanySizeEnum;
use App\Enums\CompanyTypeEnum;
use App\Enums\VerificationStatusEnum;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Company>
 */
final class CompanyFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->unique()->company(),
            'industry_id' => null,
            'website_url' => fake()->url(),
            'description' => fake()->paragraph(3),
            'email' => fake()->unique()->companyEmail(),
            'phone' => fake()->unique()->phoneNumber(),
            'size' => fake()->randomElement(CompanySizeEnum::values()),
            'type' => fake()->randomElement(CompanyTypeEnum::values()),
            'verification_status' => fake()->randomElement(VerificationStatusEnum::values()),
        ];
    }
}
