<?php

declare(strict_types=1);

namespace App\Exports;

use App\Models\User;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

final class StudentsExport implements FromCollection, WithHeadings
{
    protected $fields;

    public function __construct(array $fields = [])
    {
        $this->fields = $fields;
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
                'userLanguages.language'
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

    protected function getFieldHeading($fieldKey)
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

        return $headingMap[$fieldKey] ?? str_replace('_', ' ', ucwords($fieldKey, '.'));
    }

    protected function getFieldValue($user, $fieldKey)
    {
        if (strpos($fieldKey, '.') !== false) {
            $parts = explode('.', $fieldKey);
            $mainField = $parts[0];
            $subField = $parts[1];

            if ($mainField === 'personal_detail') {
                return $user->personalDetail->{$subField} ?? null;
            } elseif ($mainField === 'address') {
                return $user->address->{$subField} ?? null;
            } elseif ($mainField === 'profile') {
                return $user->profile->{$subField} ?? null;
            } elseif ($mainField === 'work_experiences') {
                return $user->workExperiences->map(function ($exp) use ($subField) {
                    return $exp->{$subField};
                })->implode(', ');
            } elseif ($mainField === 'educations') {
                return $user->educations->map(function ($edu) use ($subField) {
                    return $edu->{$subField};
                })->implode(', ');
            } elseif ($mainField === 'certificates') {
                return $user->certificates->map(function ($cert) use ($subField) {
                    return $cert->{$subField};
                })->implode(', ');
            } elseif ($mainField === 'user_languages') {
                // Handle language relationship
                if ($subField === 'language_id' && isset($user->userLanguages)) {
                    return $user->userLanguages->map(function ($userLang) {
                        return $userLang->language->name ?? null;
                    })->filter()->implode(', ');
                }

                return $user->userLanguages->map(function ($lang) use ($subField) {
                    return $lang->{$subField};
                })->implode(', ');
            }
        }

        switch ($fieldKey) {
            case 'name':
            case 'email':
            case 'phone':
                return $user->{$fieldKey};

            case 'skills':
                return $user->skills->pluck('name')->implode(', ');

            case 'work_permits':
                return $user->workPermits->pluck('country')->implode(', ');

            case 'summary':
            case 'course_completed':
            case 'student_id':
            case 'completed_month':
            case 'is_verified':
                return $user->profile->{$fieldKey} ?? null;

            default:
                return null;
        }
    }
}