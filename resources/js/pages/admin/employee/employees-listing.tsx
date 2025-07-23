import { DataTable } from '@/components/data-table';
import AppLayout from '@/layouts/app-layout';
import { User, type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { columns } from './employee-columns';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Employees',
        href: '/admin/employees',
    },
];

interface Props {
    employees: {
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

export default function EmployeesListing({ employees, filters }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Employees" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <DataTable
                    hasCreate={false}
                    columns={columns}
                    data={employees.data}
                    pagination={{
                        current_page: employees.current_page,
                        last_page: employees.last_page,
                        per_page: employees.per_page,
                        total: employees.total,
                    }}
                    filters={filters}
                    routeName="/admin/employees"
                    listingName="job title"
                    createUrl="/admin/employees/create"
                />
            </div>
        </AppLayout>
    );
}
