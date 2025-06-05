import { DataTable } from '@/components/data-table';
import AppLayout from '@/layouts/app-layout';
import { OpeningTItle, type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { columns } from './job-title-colums';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Job Titles',
        href: route('admin.job-titles.index'),
    },
];

export default function SkillsListing({ job_titles }: { job_titles: OpeningTItle[] }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Job titles" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <DataTable columns={columns} data={job_titles} listingName="job title" createUrl={route('admin.job-titles.create')} />
            </div>
        </AppLayout>
    );
}
