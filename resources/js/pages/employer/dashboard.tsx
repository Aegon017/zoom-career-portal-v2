import StatsWidget from '@/components/widgets/stats-widget';
import AppLayout from '@/layouts/employer-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Briefcase } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Employer Dashboard',
        href: '/employer/dashboard',
    },
];

interface Props {
    noOfJobs: number;
    noOfShortlisted: number;
    noOfPublishedJobs: number;
    noOfDraftJobs: number;
    noOfClosedJobs: number;
    noOfHired: number;
    noOfApplications: number;
}

const EmployerDashboard = ( { noOfJobs, noOfShortlisted, noOfPublishedJobs, noOfDraftJobs, noOfClosedJobs, noOfHired, noOfApplications }: Props ) => {
    return (
        <AppLayout breadcrumbs={ breadcrumbs }>
            <Head title="Employer dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <StatsWidget
                        title="Total Jobs"
                        icon={ Briefcase }
                        stat={ noOfJobs }
                        description="Total number of Jobs"
                        bgColor="bg-sky-600"
                        textColor="text-sky-600"
                    />
                    <StatsWidget
                        title="Total Published Jobs"
                        icon={ Briefcase }
                        stat={ noOfPublishedJobs }
                        description="Total number of published jobs"
                        bgColor="bg-amber-600"
                        textColor="text-amber-600"
                    />
                    <StatsWidget
                        title="Total Closed Jobs"
                        icon={ Briefcase }
                        stat={ noOfClosedJobs }
                        description="Total number of closed jobs"
                        bgColor="bg-indigo-600"
                        textColor="text-indigo-600"
                    />
                    <StatsWidget
                        title="Total Drafted Jobs"
                        icon={ Briefcase }
                        stat={ noOfDraftJobs }
                        description="Total number of draft jobs"
                        bgColor="bg-rose-600"
                        textColor="text-rose-600"
                    />
                    <StatsWidget
                        title="Total Applications"
                        icon={ Briefcase }
                        stat={ noOfApplications }
                        description="Total number of job applicaions"
                        bgColor="bg-yellow-600"
                        textColor="text-yellow-600"
                    />
                    <StatsWidget
                        title="Total Shortlisted"
                        icon={ Briefcase }
                        stat={ noOfShortlisted }
                        description="Total number of shortilisted job applicaions"
                        bgColor="bg-blue-600"
                        textColor="text-blue-600"
                    />
                    <StatsWidget
                        title="Total Hired"
                        icon={ Briefcase }
                        stat={ noOfHired }
                        description="Total number of hired candidates"
                        bgColor="bg-orange-600"
                        textColor="text-orange-600"
                    />
                </div>
            </div>
        </AppLayout>
    );
};

export default EmployerDashboard;
