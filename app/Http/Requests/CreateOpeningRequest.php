<?php

namespace App\Http\Requests;

use App\Enums\CurrencyEnum;
use App\Enums\EmploymentTypeEnum;
use App\Enums\JobStatusEnum;
use App\Enums\VerificationStatusEnum;
use App\Enums\WorkModelEnum;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CreateOpeningRequest extends FormRequest
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
            'employment_type' => ['required', Rule::enum(EmploymentTypeEnum::class)],
            'work_model' => ['required', Rule::enum(WorkModelEnum::class)],
            'description' => 'required|string',
            'salary_min' => 'nullable|numeric|min:0',
            'salary_max' => 'nullable|numeric|gte:salary_min',
            'salary_unit' => 'nullable|string|max:50',
            'currency' => ['required', Rule::enum(CurrencyEnum::class)],
            'city' => 'nullable|string|max:100',
            'state' => 'nullable|string|max:100',
            'country' => 'nullable|string|max:100',
            'published_at' => 'date',
            'expires_at' => 'required|date|after:published_at',
            'status' => ['required', Rule::enum(JobStatusEnum::class)],
            'verification_status' => [Rule::enum(VerificationStatusEnum::class)],
            'skills' => 'required|array',
        ];
    }
}
