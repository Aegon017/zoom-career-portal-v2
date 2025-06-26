import { DataTable } from '@/components/data-table';
import AppLayout from '@/layouts/app-layout';
import { Skill, type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { columns } from './skill-columns';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Skills',
        href: "/admin/skills",
    },
];

export default function SkillsListing({ skills }: { skills: Skill[] }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Skills" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <DataTable columns={columns} data={skills} listingName="skill" createUrl="/admin/skills/create" />
            </div>
        </AppLayout>
    );
}
