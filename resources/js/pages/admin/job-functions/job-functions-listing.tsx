import { DataTable } from '@/components/data-table';
import AppLayout from '@/layouts/app-layout';
import { Industry, JobFunction, type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { columns } from './job-function-columns';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Job functions',
        href: route('admin.job-functions.index'),
    },
];

interface Props {
    jobFunctions: JobFunction[]
}

export default function IndustriesListing({ jobFunctions }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Industries" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <DataTable columns={columns} data={jobFunctions} listingName="job function" createUrl={route('admin.job-functions.create')} />
            </div>
        </AppLayout>
    );
}
