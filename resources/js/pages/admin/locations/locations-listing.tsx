import { DataTable } from '@/components/data-table';
import AppLayout from '@/layouts/app-layout';
import { Location, type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { columns } from './location-columns';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Locations',
        href: '/admin/locations',
    },
];

interface Props {
    locations: {
        data: Location[];
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

export default function LocationsListing({ locations, filters }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Locations" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <DataTable
                    columns={columns}
                    data={locations.data}
                    pagination={{
                        current_page: locations.current_page,
                        last_page: locations.last_page,
                        per_page: locations.per_page,
                        total: locations.total,
                    }}
                    filters={filters}
                    routeName="/admin/locations"
                    listingName="location"
                    createUrl="/admin/locations/create"
                />
            </div>
        </AppLayout>
    );
}
