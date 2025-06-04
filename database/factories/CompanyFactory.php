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
            'company_name' => fake()->company(),
            'company_logo' => fake()->imageUrl(640, 480, 'business'),
            'industry' => fake()->randomElement(['Technology', 'Healthcare', 'Finance', 'Education', 'Manufacturing']),
            'company_website' => fake()->url(),
            'company_description' => fake()->paragraph(3),
            'company_address' => fake()->address(),
            'public_phone' => fake()->phoneNumber(),
            'public_email' => fake()->companyEmail(),
            'company_size' => fake()->randomElement(CompanySizeEnum::values()),
            'company_type' => fake()->randomElement(CompanyTypeEnum::values()),
            'verification_status' => fake()->randomElement(VerificationStatusEnum::values()),
        ];
    }
}
