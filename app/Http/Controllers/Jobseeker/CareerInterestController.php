<?php

declare(strict_types=1);

namespace App\Http\Controllers\Jobseeker;

use App\Enums\EmploymentTypeEnum;
use App\Http\Controllers\Controller;
use App\Models\Industry;
use App\Models\Location;
use App\Models\OpeningTitle;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

final class CareerInterestController extends Controller
{
    public function index()
    {
        $careerInterest = Auth::user()->careerInterest;

        $employmentTypes = EmploymentTypeEnum::options();

        $years = range(date('Y'), date('Y') - 10);
        $months = [];
        for ($i = 1; $i <= 12; ++$i) {
            $months[] = date('F', mktime(0, 0, 0, $i, 1));
        }

        $industries = Industry::get()->map(fn ($industry): array => [
            'value' => $industry->id,
            'label' => $industry->name,
        ]);

        $locations = Location::get()->take(100)->map(fn ($location): array => [
            'value' => $location->id,
            'label' => $location->full_name,
        ]);

        $jobTitles = OpeningTitle::get()->map(fn ($jobTitle): array => [
            'value' => $jobTitle->id,
            'label' => $jobTitle->name,
        ]);

        return Inertia::render('jobseeker/career-interests', [
            'initialValues' => [
                'graduation_month' => $careerInterest?->graduation_month,
                'graduation_year' => $careerInterest?->graduation_year,
                'employment_types' => $careerInterest?->employmentTypes->pluck('employment_type'),
                'desired_jobs' => $careerInterest?->jobTitles->pluck('opening_title_id'),
                'target_industries' => $careerInterest?->industries->pluck('industry_id'),
                'preferred_locations' => $careerInterest?->locations->pluck('location_id'),
            ],
            'employmentTypes' => $employmentTypes,
            'years' => $years,
            'months' => $months,
            'industries' => $industries,
            'locations' => $locations,
            'jobTitles' => $jobTitles,
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'employment_types' => 'nullable|array',
            'employment_types.*' => 'string',
            'desired_jobs' => 'nullable|array',
            'desired_jobs.*' => 'integer',
            'preferred_locations' => 'nullable|array',
            'preferred_locations.*' => 'integer',
            'target_industries' => 'nullable|array',
            'target_industries.*' => 'integer',
            'graduation_month' => 'nullable|string',
            'graduation_year' => 'nullable|string',
        ]);

        $user = Auth::user();

        $careerInterest = $user->careerInterest()->firstOrCreate([], [
            'graduation_month' => $validated['graduation_month'] ?? null,
            'graduation_year' => $validated['graduation_year'] ?? null,
        ]);

        $careerInterest->update([
            'graduation_month' => $validated['graduation_month'] ?? null,
            'graduation_year' => $validated['graduation_year'] ?? null,
        ]);

        $careerInterest->employmentTypes()?->delete();
        if (! empty($validated['employment_types'])) {
            $careerInterest->employmentTypes()->createMany(
                collect($validated['employment_types'])->map(fn ($type): array => [
                    'employment_type' => $type,
                ])->toArray()
            );
        }

        $careerInterest->jobTitles()?->delete();
        if (! empty($validated['desired_jobs'])) {
            $careerInterest->jobTitles()->createMany(
                collect($validated['desired_jobs'])->map(fn ($id): array => [
                    'opening_title_id' => $id,
                ])->toArray()
            );
        }

        $careerInterest->industries()?->delete();
        if (! empty($validated['target_industries'])) {
            $careerInterest->industries()->createMany(
                collect($validated['target_industries'])->map(fn ($id): array => [
                    'industry_id' => $id,
                ])->toArray()
            );
        }

        $careerInterest->locations()?->delete();
        if (! empty($validated['preferred_locations'])) {
            $careerInterest->locations()->createMany(
                collect($validated['preferred_locations'])->map(fn ($id): array => [
                    'location_id' => $id,
                ])->toArray()
            );
        }

        return redirect()->back()->with('success', 'Career interest saved successfully!');
    }
}
