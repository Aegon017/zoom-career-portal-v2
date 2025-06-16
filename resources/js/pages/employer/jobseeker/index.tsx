import JobseekerCard from "@/components/employer/jobseeker-card";
import JobseekerFilters from "@/components/employer/jobseeker-filters";
import { Button } from "@/components/ui/button";
import AppLayout from "@/layouts/employer-layout"
import { BreadcrumbItem, Jobseeker } from "@/types";
import { Head } from "@inertiajs/react";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Jobseekers',
        href: route('employer.jobseekers.index'),
    },
];

interface Props {
    jobseekers: Jobseeker[]
}

const Index = ({ jobseekers }: Props) => {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="jobs" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <JobseekerFilters />
                <div className="flex flex-col w-full md:w-2xl mx-auto">
                    <span className="mb-4 text-sm text-muted-foreground">
                        10 of 300
                    </span>
                    {jobseekers.map(jobseeker => (
                        <JobseekerCard key={jobseeker.id} jobseeker={jobseeker} />
                    ))}
                </div>
                <div className="flex justify-center mt-6">
                    <Button variant="outline">
                        Load More
                    </Button>
                </div>
            </div>
        </AppLayout>
    )
}

export default Index