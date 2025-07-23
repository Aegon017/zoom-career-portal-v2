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
    skills: {
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

export default function SkillsListing({ skills, filters }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Skills" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <DataTable
                    columns={columns}
                    data={skills.data}
                    pagination={{
                        current_page: skills.current_page,
                        last_page: skills.last_page,
                        per_page: skills.per_page,
                        total: skills.total,
                    }}
                    filters={filters}
                    routeName="/admin/skills"
                    listingName="skill"
                    createUrl="/admin/skills/create"
                />
            </div>
        </AppLayout>
    );
}
