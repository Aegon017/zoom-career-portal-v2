<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

final class WorkExperienceResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $company = $this->company;

        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'company_id' => $this->company_id,
            'company_name' => $this->company_name,
            'title' => $this->title,
            'start_date' => $this->start_date,
            'end_date' => $this->end_date,
            'is_current' => $this->is_current,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,

            'company' => $company ? [
                'id' => $company->id,
                'name' => $company->name,
                'company_logo' => $company->getFirstMediaUrl('company_logo'),
            ] : null,

            'company_logo' => $company ? null : $this->getFirstMediaUrl('company_logo'),
        ];
    }
}
