import { DataTable } from '@/components/data-table';
import AppLayout from '@/layouts/app-layout';
import { Opening, type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { columns } from './job-columns';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'jobs',
        href: '/admin/jobs',
    },
];

interface Props {
    jobs: {
        data: Opening[];
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

export default function jobsListing( { jobs, filters }: Props ) {
    return (
        <AppLayout breadcrumbs={ breadcrumbs }>
            <Head title="jobs" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <DataTable
                    hasCreate={ false }
                    columns={ columns }
                    data={ jobs.data }
                    pagination={ {
                        current_page: jobs.current_page,
                        last_page: jobs.last_page,
                        per_page: jobs.per_page,
                        total: jobs.total,
                    } }
                    filters={ filters }
                    routeName=""
                    listingName="job"
                    createUrl=""
                />
            </div>
        </AppLayout>
    );
}
