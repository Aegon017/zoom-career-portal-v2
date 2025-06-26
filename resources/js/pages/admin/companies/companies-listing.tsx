import { DataTable } from '@/components/data-table';
import AppLayout from '@/layouts/app-layout';
import { Company, type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { columns } from './company-columns';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Companies',
        href: "/admin/companies",
    },
];

interface Props {
    companies: Company[]
}

export default function CompaniesListing({ companies }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Companies" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <DataTable columns={columns} data={companies} listingName="company" hasCreate={false} createUrl="/admin/companies/create" />
            </div>
        </AppLayout>
    );
}
