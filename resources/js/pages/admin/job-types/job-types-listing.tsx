import { DataTable } from '@/components/data-table';
import AppLayout from '@/layouts/app-layout';
import { JobType, type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { columns } from './job-type-columns';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Job types',
        href: "/admin/job-types",
    },
];

interface Props {
    jobTypes: JobType[]
}

export default function IndustriesListing({ jobTypes }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Job types" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <DataTable columns={columns} data={jobTypes} listingName="job type" createUrl="/admin/job-types/create" />
            </div>
        </AppLayout>
    );
}
