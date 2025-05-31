<?php

namespace App\Http\Requests\Company;

use Illuminate\Foundation\Http\FormRequest;

class StoreCompanyRequest extends FormRequest
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
            'profile_image' => 'nullable|string',
            'company_name' => 'required|string|max:255',
            'company_logo' => 'nullable|string',
            'industry' => 'required|string|max:100',
            'company_website' => 'required|url|max:255',
            'company_description' => 'required|string|max:1000',
            'company_address' => 'required|string|max:255',
            'public_phone' => 'nullable|string|max:20',
            'public_email' => 'nullable|email|max:255',
            'company_size' => 'required|string|max:50',
            'company_type' => 'required|string|max:50'
        ];
    }
}
