import { DataTable } from '@/components/data-table';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Role } from '@/types';
import { Head } from '@inertiajs/react';
import { columns } from './role-columns';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Roles',
        href: "/admin/roles",
    },
];

interface Props {
    roles: Role[]
}

export default function RolesListing( { roles }: Props ) {
    return (
        <AppLayout breadcrumbs={ breadcrumbs }>
            <Head title="Roles" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <DataTable columns={ columns } data={ roles } listingName="role" createUrl="/admin/roles/create" />
            </div>
        </AppLayout>
    );
}
