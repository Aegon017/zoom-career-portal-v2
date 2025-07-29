import { DataTable } from '@/components/data-table';
import AppLayout from '@/layouts/app-layout';
import { Feedback, type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { columns } from './feedback-columns';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Feedback',
        href: '/admin/feedback',
    },
];

interface Props {
    feedback: {
        data: Feedback[];
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

export default function FeedbackListing( { feedback, filters }: Props ) {
    return (
        <AppLayout breadcrumbs={ breadcrumbs }>
            <Head title="Feedback" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <DataTable
                    hasCreate={ false }
                    columns={ columns }
                    data={ feedback.data }
                    pagination={ {
                        current_page: feedback.current_page,
                        last_page: feedback.last_page,
                        per_page: feedback.per_page,
                        total: feedback.total,
                    } }
                    filters={ filters }
                    routeName="/admin/feedback"
                    listingName="feedback"
                    createUrl="/admin/feedback/create"
                />
            </div>
        </AppLayout>
    );
}
