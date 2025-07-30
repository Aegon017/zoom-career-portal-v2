import CompanyDetails from '@/components/company-details';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Company } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Company',
        href: '',
    },
];

interface Props {
    company: Company;
}

const ViewCompany = ( { company }: Props ) => {
    return (
        <AppLayout breadcrumbs={ breadcrumbs }>
            <Head title="Company" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 sm:p-6 lg:p-8">
                <CompanyDetails company={ company } />
            </div>
        </AppLayout>
    );
};

export default ViewCompany;
