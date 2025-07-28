<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Enums\CurrencyEnum;
use App\Enums\EmploymentTypeEnum;
use App\Enums\JobStatusEnum;
use App\Enums\VerificationStatusEnum;
use App\Enums\WorkModelEnum;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

final class CreateOpeningRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'skills' => 'required|array',
            'skills.*' => 'required|exists:skills,id',
            'description' => ['required', 'string', function ($attribute, $value, $fail) {
                if (trim(strip_tags($value)) === '') {
                    $fail('The job description field is required.');
                }
            }],
            'employment_type' => ['required', Rule::enum(EmploymentTypeEnum::class)],
            'work_model' => ['required', Rule::enum(WorkModelEnum::class)],
            'salary_min' => 'required|numeric|min:0',
            'salary_max' => 'required|numeric|gte:salary_min',
            'salary_unit' => 'required|string|max:50',
            'currency' => ['required', Rule::enum(CurrencyEnum::class)],
            'location_id' => 'required|exists:locations,id',
            'industry_id' => 'required|exists:industries,id',
            'expires_at' => 'required|date|after:today',
            'apply_link' => 'nullable|url|max:255',
            'status' => ['required', Rule::enum(JobStatusEnum::class)],
            'verification_status' => ['nullable', Rule::enum(VerificationStatusEnum::class)],
        ];
    }
}
