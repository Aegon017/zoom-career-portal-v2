import { DataTable } from '@/components/data-table';
import AppLayout from '@/layouts/app-layout';
import { User, type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { columns } from './student-columns';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'students',
        href: '/admin/students',
    },
];

interface Props {
    students: {
        data: User[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    filters: {
        search?: string;
        perPage?: number;
    };
}

export default function studentsListing( { students, filters }: Props ) {
    return (
        <AppLayout breadcrumbs={ breadcrumbs }>
            <Head title="Students" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <DataTable
                    hasCreate={ true }
                    columns={ columns }
                    data={ students.data }
                    pagination={ {
                        current_page: students.current_page,
                        last_page: students.last_page,
                        per_page: students.per_page,
                        total: students.total,
                    } }
                    filters={ filters }
                    routeName="/admin/students"
                    listingName="student"
                    createUrl="/admin/students/create"
                    hasExport={ true }
                    exportUrl="/admin/students/export"
                    exportFields={ [
                        { key: 'name', label: 'Full Name', selected: true },
                        { key: 'email', label: 'Email', selected: true },
                        { key: 'phone', label: 'Phone', selected: true },

                        { key: 'personal_detail.gender', label: 'Gender', selected: true },
                        { key: 'personal_detail.marital_status', label: 'Marital Status', selected: true },
                        { key: 'personal_detail.date_of_birth', label: 'Date of Birth', selected: true },
                        { key: 'personal_detail.differently_abled', label: 'Differently Abled', selected: false },
                        { key: 'address.location_id', label: 'Address/Location', selected: true },

                        { key: 'profile.job_title', label: 'Job Title', selected: true },
                        { key: 'profile.experience', label: 'Experience', selected: true },
                        { key: 'profile.notice_period', label: 'Notice Period', selected: true },

                        { key: 'skills', label: 'Skills', selected: true },

                        { key: 'work_permits', label: 'Work Permits', selected: true },

                        { key: 'work_experiences', label: 'Work Experiences', selected: true },
                        { key: 'work_experiences.title', label: 'Job Title (Work)', selected: true },
                        { key: 'work_experiences.company_name', label: 'Company Name', selected: true },
                        { key: 'work_experiences.start_date', label: 'Employment Start Date', selected: true },
                        { key: 'work_experiences.end_date', label: 'Employment End Date', selected: true },
                        { key: 'work_experiences.is_current', label: 'Current Employment', selected: true },

                        { key: 'educations', label: 'Education History', selected: true },
                        { key: 'educations.course_title', label: 'Course Title', selected: true },
                        { key: 'educations.institution', label: 'Institution', selected: true },
                        { key: 'educations.course_type', label: 'Course Type', selected: true },
                        { key: 'educations.start_date', label: 'Education Start Date', selected: true },
                        { key: 'educations.end_date', label: 'Education End Date', selected: true },
                        { key: 'educations.is_current', label: 'Currently Studying', selected: true },

                        { key: 'certificates', label: 'Certifications', selected: true },
                        { key: 'certificates.name', label: 'Certificate Name', selected: true },

                        { key: 'user_languages', label: 'Languages', selected: true },
                        { key: 'user_languages.language_id', label: 'Language', selected: true },
                        { key: 'user_languages.proficiency', label: 'Proficiency Level', selected: true },
                        { key: 'user_languages.can_read', label: 'Can Read', selected: false },
                        { key: 'user_languages.can_write', label: 'Can Write', selected: false },
                        { key: 'user_languages.can_speak', label: 'Can Speak', selected: false },

                        { key: 'summary', label: 'Summary', selected: true },
                        { key: 'course_completed', label: 'Course Completed', selected: true },
                        { key: 'student_id', label: 'Student ID', selected: true },
                        { key: 'completed_month', label: 'Completed Month', selected: false },
                        { key: 'is_verified', label: 'Is Verified', selected: true },
                    ] }
                />
            </div>
        </AppLayout>
    );
}