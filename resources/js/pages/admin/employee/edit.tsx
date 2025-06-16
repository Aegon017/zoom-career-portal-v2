import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Employee',
        href: route('admin.employee.index'),
    },
    {
        title: 'Edit',
        href: '',
    },
];

export default function Show() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Employee edit" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">

            </div>
        </AppLayout>
    );
}
