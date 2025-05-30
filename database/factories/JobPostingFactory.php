<?php

namespace Database\Factories;

use App\Enums\CurrencyEnum;
use App\Enums\EmploymentTypeEnum;
use App\Enums\JobStatusEnum;
use App\Enums\ModerationStatusEnum;
use App\Enums\SalaryUnitEnum;
use App\Enums\WorkModelEnum;
use App\Models\Company;
use App\Models\Employer;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\JobPosting>
 */
class JobPostingFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'company_id' => Company::factory(),
            'employer_id' => Employer::factory(),
            'title' => fake()->jobTitle(),
            'employment_type' => fake()->randomElement(EmploymentTypeEnum::values()),
            'work_model' => fake()->randomElement(WorkModelEnum::values()),
            'description' => fake()->paragraphs(3, true),
            'salary_min' => fake()->numberBetween(30000, 80000),
            'salary_max' => fake()->numberBetween(81000, 150000),
            'salary_unit' => fake()->randomElement(SalaryUnitEnum::values()),
            'currency' => fake()->randomElement(CurrencyEnum::values()),
            'city' => fake()->city(),
            'state' => fake()->state(),
            'country' => fake()->country(),
            'published_at' => fake()->dateTimeBetween('-1 month', 'now'),
            'expires_at' => fake()->dateTimeBetween('now', '+2 months'),
            'status' => fake()->randomElement(JobStatusEnum::values()),
            'moderation_status' => fake()->randomElement(ModerationStatusEnum::values())
        ];
    }
}
