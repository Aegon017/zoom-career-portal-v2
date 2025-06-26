import { DataTable } from '@/components/data-table';
import AppLayout from '@/layouts/app-layout';
import { Industry, type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { columns } from './industry-columns';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Industries',
        href: "/admin/industries",
    },
];

interface Props {
    industries: Industry[]
}

export default function IndustriesListing({ industries }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Industries" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <DataTable columns={columns} data={industries} listingName="industry" createUrl={`/admin/industries/create`} />
            </div>
        </AppLayout>
    );
}
