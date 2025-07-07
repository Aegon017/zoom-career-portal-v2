import { DataTable } from '@/components/data-table';
import AppLayout from '@/layouts/app-layout';
import { Language, type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { columns } from './language-columns';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Languages',
        href: "/admin/languages",
    },
];

interface Props {
    languages: {
        data: Language[],
        current_page: number,
        last_page: number,
        per_page: number,
        total: number,
    },
    filters: {
        search?: string,
        perPage?: number,
    }
}

export default function LanguagesListing( { languages, filters }: Props ) {
    return (
        <AppLayout breadcrumbs={ breadcrumbs }>
            <Head title="Languages" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <DataTable
                    columns={ columns }
                    data={ languages.data }
                    pagination={ {
                        current_page: languages.current_page,
                        last_page: languages.last_page,
                        per_page: languages.per_page,
                        total: languages.total,
                    } }
                    filters={ filters }
                    routeName="/admin/languages"
                    listingName="language"
                    createUrl="/admin/languages/create"
                />
            </div>
        </AppLayout>
    );
}
