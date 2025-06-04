import { DataTable } from '@/components/data-table';
import AppLayout from '@/layouts/app-layout';
import { TalentProfile, type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { columns } from './talent-profile-columns';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Talent Profiles',
        href: route('admin.talent-profiles.index'),
    },
];

export default function TalentProfilesListing({ talent_profiles }: { talent_profiles: TalentProfile[] }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Talent profiles" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <DataTable columns={columns} data={talent_profiles} listingName="talent profile" createUrl={route('admin.talent-profiles.create')} />
            </div>
        </AppLayout>
    );
}
