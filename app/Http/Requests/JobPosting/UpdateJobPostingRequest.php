<?php

namespace App\Http\Requests\JobPosting;

use App\Enums\CurrencyEnum;
use App\Enums\EmploymentTypeEnum;
use App\Enums\JobStatusEnum;
use App\Enums\VerificationStatusEnum;
use App\Enums\WorkModelEnum;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateJobPostingRequest extends FormRequest
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
            'company_id'        => 'sometimes|exists:companies,id',
            'employer_id'       => 'sometimes|exists:employers,id',
            'title'             => 'sometimes|required|string|max:255',
            'employment_type'   => ['sometimes', 'required', Rule::enum(EmploymentTypeEnum::class)],
            'work_model'        => ['sometimes', 'required', Rule::enum(WorkModelEnum::class)],
            'description'       => 'sometimes|required|string',
            'salary_min'        => 'sometimes|nullable|numeric|min:0',
            'salary_max'        => 'sometimes|nullable|numeric|gte:salary_min',
            'salary_unit'       => 'sometimes|nullable|string|max:50',
            'currency'          => ['sometimes', 'required', Rule::enum(CurrencyEnum::class)],
            'city'              => 'sometimes|nullable|string|max:100',
            'state'             => 'sometimes|nullable|string|max:100',
            'country'           => 'sometimes|nullable|string|max:100',
            'published_at'      => 'sometimes|date',
            'expires_at'        => 'sometimes|required|date|after:published_at',
            'status'            => ['sometimes', 'required', Rule::enum(JobStatusEnum::class)],
            'verification_status' => ['sometimes', Rule::enum(VerificationStatusEnum::class)],
            'skills'   => 'sometimes|required|array',
        ];
    }
}
