<?php

declare(strict_types=1);

namespace App\Exports;

use App\Models\User;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

final readonly class StudentsExport implements FromCollection, WithHeadings
{
    public function __construct(private array $fields = [])
    {
    }

    /**
     * @return \Illuminate\Support\Collection
     */
    public function collection()
    {
        $users = User::role('jobseeker')
            ->with([
                'personalDetail',
                'address',
                'profile',
                'skills',
                'workPermits',
                'workExperiences',
                'educations',
                'certificates',
                'userLanguages.language',
            ])
            ->get();

        return $users->map(function ($user, $index) {
            $row = ['serial' => $index + 1];

            foreach ($this->fields as $field) {
                if ($field) {
                    $value = $this->getFieldValue($user, $field);
                    $row[$field] = $value;
                }
            }

            return $row;
        });
    }

    public function headings(): array
    {
        $headings = ['Serial Number'];

        foreach ($this->fields as $field) {
            if ($field) {
                // Convert field keys to readable headings
                $headings[] = $this->getFieldHeading($field);
            }
        }

        return $headings;
    }

    private function getFieldHeading($fieldKey): string|array
    {
        // Map field keys to human-readable headings
        $headingMap = [
            'name' => 'Full Name',
            'email' => 'Email',
            'phone' => 'Phone',
            'personal_detail.gender' => 'Gender',
            'personal_detail.marital_status' => 'Marital Status',
            'personal_detail.date_of_birth' => 'Date of Birth',
            'personal_detail.differently_abled' => 'Differently Abled',
            'address.location_id' => 'Address/Location',
            'profile.job_title' => 'Job Title',
            'profile.experience' => 'Experience',
            'profile.notice_period' => 'Notice Period',
            'skills' => 'Skills',
            'work_permits' => 'Work Permits',
            'work_experiences' => 'Work Experiences',
            'work_experiences.title' => 'Job Title (Work)',
            'work_experiences.company_name' => 'Company Name',
            'work_experiences.start_date' => 'Employment Start Date',
            'work_experiences.end_date' => 'Employment End Date',
            'work_experiences.is_current' => 'Current Employment',
            'educations' => 'Education History',
            'educations.course_title' => 'Course Title',
            'educations.institution' => 'Institution',
            'educations.course_type' => 'Course Type',
            'educations.start_date' => 'Education Start Date',
            'educations.end_date' => 'Education End Date',
            'educations.is_current' => 'Currently Studying',
            'certificates' => 'Certifications',
            'certificates.name' => 'Certificate Name',
            'user_languages' => 'Languages',
            'user_languages.language_id' => 'Language',
            'user_languages.proficiency' => 'Proficiency Level',
            'user_languages.can_read' => 'Can Read',
            'user_languages.can_write' => 'Can Write',
            'user_languages.can_speak' => 'Can Speak',
            'summary' => 'Summary',
            'course_completed' => 'Course Completed',
            'student_id' => 'Student ID',
            'completed_month' => 'Completed Month',
            'is_verified' => 'Is Verified',
        ];

        return $headingMap[$fieldKey] ?? str_replace('_', ' ', ucwords((string) $fieldKey, '.'));
    }

    private function getFieldValue($user, $fieldKey)
    {
        if (mb_strpos((string) $fieldKey, '.') !== false) {
            $parts = explode('.', (string) $fieldKey);
            $mainField = $parts[0];
            $subField = $parts[1];

            if ($mainField === 'personal_detail') {
                return $user->personalDetail->{$subField} ?? null;
            }

            if ($mainField === 'address') {
                return $user->address->{$subField} ?? null;
            }

            if ($mainField === 'profile') {
                return $user->profile->{$subField} ?? null;
            }

            if ($mainField === 'work_experiences') {
                return $user->workExperiences->map(fn($exp) => $exp->{$subField})->implode(', ');
            }
            if ($mainField === 'educations') {
                return $user->educations->map(fn($edu) => $edu->{$subField})->implode(', ');
            }
            if ($mainField === 'certificates') {
                return $user->certificates->map(fn($cert) => $cert->{$subField})->implode(', ');
            }
            if ($mainField === 'user_languages') {
                // Handle language relationship
                if ($subField === 'language_id' && isset($user->userLanguages)) {
                    return $user->userLanguages->map(fn($userLang) => $userLang->language->name ?? null)->filter()->implode(', ');
                }
                return $user->userLanguages->map(fn($lang) => $lang->{$subField})->implode(', ');
            }
        }

        return match ($fieldKey) {
            'name', 'email', 'phone' => $user->{$fieldKey},
            'skills' => $user->skills->pluck('name')->implode(', '),
            'work_permits' => $user->workPermits->pluck('country')->implode(', '),
            'summary', 'course_completed', 'student_id', 'completed_month', 'is_verified' => $user->profile->{$fieldKey} ?? null,
            default => null,
        };
    }
}
