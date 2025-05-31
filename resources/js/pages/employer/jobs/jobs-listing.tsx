import { DataTable } from '@/components/data-table';
import AppLayout from '@/layouts/app-layout';
import { JobPosting, type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { columns } from './job-columns';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'jobs',
        href: route('job-postings.index'),
    },
];

export default function jobsListing({ jobs }: { jobs: JobPosting[] }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="jobs" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <DataTable columns={columns} data={jobs} listingName="job" createUrl={route('job-postings.create')} />
            </div>
        </AppLayout>
    );
}
