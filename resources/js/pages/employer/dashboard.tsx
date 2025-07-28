import StatsWidget from '@/components/widgets/stats-widget';
import AppLayout from '@/layouts/employer-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { GraduationCap } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Employer Dashboard',
        href: '/employer/dashboard',
    },
];

const EmployerDashboard = () => {
    const noOfApplied = 23;
    return (
        <AppLayout breadcrumbs={ breadcrumbs }>
            <Head title="Employer dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <StatsWidget
                        title="Total Applied"
                        icon={ GraduationCap }
                        stat={ noOfApplied }
                        description="Total number of applied"
                        bgColor="bg-sky-600"
                        textColor="text-sky-600"
                    />
                </div>
            </div>
        </AppLayout>
    );
};

export default EmployerDashboard;
