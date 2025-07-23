import { DataTable } from '@/components/data-table';
import AppLayout from '@/layouts/app-layout';
import { User, type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { columns } from './user-columns';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Users',
        href: '/admin/users',
    },
];

interface Props {
    users: {
        data: User[];
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

export default function UsersListing({ users, filters }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <DataTable
                    columns={columns}
                    data={users.data}
                    pagination={{
                        current_page: users.current_page,
                        last_page: users.last_page,
                        per_page: users.per_page,
                        total: users.total,
                    }}
                    filters={filters}
                    routeName="/admin/users"
                    listingName="user"
                    createUrl="/admin/users/create"
                />
            </div>
        </AppLayout>
    );
}
