import { DataTable } from '@/components/data-table';
import AppLayout from '@/layouts/app-layout';
import { User, type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { columns } from './employee-columns';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Employees',
        href: "/admin/employees",
    },
];

interface Props {
    employees: User[]
}

export default function EmployeesListing( { employees }: Props ) {
    return (
        <AppLayout breadcrumbs={ breadcrumbs }>
            <Head title="Employees" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <DataTable columns={ columns } data={ employees } listingName="employee" hasCreate={ false } createUrl="/admin/employees/create" />
            </div>
        </AppLayout>
    );
}
