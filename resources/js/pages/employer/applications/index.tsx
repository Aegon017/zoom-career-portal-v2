import JobApplicationCard from '@/components/job-application-card';
import JobApplicationsFilter from '@/components/job-applications-filter';
import AppLayout from '@/layouts/employer-layout';
import { Application, ApplicationStatus, BreadcrumbItem, Opening } from '@/types';
import { Head } from '@inertiajs/react';
import { User } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Applications',
        href: '/employer/applications',
    },
];

interface Props {
    jobs: Opening[];
    job_id?: number;
    applications: Application[];
    statuses: ApplicationStatus[];
    skills: any;
}

const Index = ({ jobs, job_id, applications, statuses, skills }: Props) => {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Applications" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <JobApplicationsFilter
                    skills={skills}
                    defaultValue={job_id}
                    jobOptions={jobs.map((job) => ({
                        value: String(job.id),
                        label: job.title,
                    }))}
                />
                {applications && applications.length > 0 ? (
                    <div className="grid gap-4 space-y-4 md:grid-cols-2">
                        {applications.map((application, index) => (
                            <JobApplicationCard key={index} application={application} statuses={statuses} />
                        ))}
                    </div>
                ) : (
                    <div className="m-auto text-center">
                        <User className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
                        {!job_id ? (
                            <>
                                <h3 className="mb-2 text-lg font-semibold">Please select a job</h3>
                                <p className="text-muted-foreground">Select a job to view its applications.</p>
                            </>
                        ) : (
                            <>
                                <h3 className="mb-2 text-lg font-semibold">No applications found</h3>
                                <p className="text-muted-foreground">Applications will appear here once candidates start applying.</p>
                            </>
                        )}
                    </div>
                )}
            </div>
        </AppLayout>
    );
};

export default Index;
