import { DataTable } from '@/components/data-table';
import AppLayout from '@/layouts/app-layout';
import { Skill, type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { columns } from './skill-columns';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Skills',
        href: '/admin/skills',
    },
];

interface Props {
    data: {
        data: Skill[];
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

export default function SkillsListing({ data, filters }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Skills" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <DataTable
                    columns={columns}
                    data={data?.data ?? []}
                    pagination={{
                        current_page: data?.current_page,
                        last_page: data?.last_page,
                        per_page: data?.per_page,
                        total: data?.total,
                    }}
                    filters={filters}
                    routeName="/admin/skills"
                    listingName="skill"
                    createUrl="/admin/skills/create"
                    hasImport={ true }
                    importUrl="/admin/skills/import"
                    importColumns={['name']}
                />
            </div>
        </AppLayout>
    );
}
