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
                />
            </div>
        </AppLayout>
    );
}