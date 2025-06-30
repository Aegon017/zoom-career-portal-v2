<?php

declare(strict_types=1);

namespace App\Http\Requests\Company;

use Illuminate\Foundation\Http\FormRequest;

final class StoreCompanyRequest extends FormRequest
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
            'name' => 'required|string|max:255',
            'logo_url' => 'nullable|string',
            'banner_url' => 'nullable|string',
            'industry_id' => 'required|integer|exists:industries,id',
            'website_url' => 'required|url|max:255',
            'description' => 'required|string|max:1000',
            'email' => 'required|email|unique:companies,email,' . $this->company?->id,
            'phone' => 'required|string|unique:companies,phone,' . $this->company?->id,
            'location_id' => 'required|integer|exists:locations,id',
            'size' => 'required|string|max:50',
            'type' => 'required|string|max:50',
        ];
    }
}
