import { DataTable } from '@/components/data-table';
import AppLayout from '@/layouts/app-layout';
import { JobType, Location, type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { columns } from './location-columns';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Locations',
        href: route('admin.locations.index'),
    },
];

interface Props {
    locations: Location[]
}

export default function IndustriesListing({ locations }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Locations" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <DataTable columns={columns} data={locations} listingName="location" createUrl={route('admin.locations.create')} />
            </div>
        </AppLayout>
    );
}
