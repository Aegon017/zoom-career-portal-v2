import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { Download, User } from 'lucide-react';

import JobApplicationCard from '@/components/job-application-card';
import { JobApplicationsFilter } from '@/components/job-applications-filter';
import AppLayout from '@/layouts/employer-layout';
import { Application, BreadcrumbItem, Opening, Option } from '@/types';
import { cn } from '@/lib/utils';

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
    statuses: Option[];
    skills: string[];
}

export default function ApplicationsIndex( { jobs, job_id, applications, statuses, skills }: Props ) {
    const hasApplications = applications?.length > 0;
    const hasSelectedJob = Boolean( job_id );

    return (
        <AppLayout breadcrumbs={ breadcrumbs }>
            <Head title="Applications" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <h1 className="text-2xl font-semibold">Candidate Applications</h1>

                    <div className="flex items-center gap-2">
                        <JobApplicationsFilter
                            statuses={ statuses }
                            skills={ skills }
                            defaultValue={ job_id }
                            jobOptions={ jobs.map( ( job ) => ( {
                                value: String( job.id ),
                                label: job.title,
                            } ) ) }
                        />
                        { hasApplications && (
                            <a
                                href='/employer/applications/download-resumes'
                                download="resumes.zip"
                                className={ cn(
                                    "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors",
                                    "bg-indigo-600 text-white shadow hover:bg-indigo-600/90 px-4 py-2"
                                ) }
                            >
                                <Download className="mr-2 h-4 w-4" />
                                Download All Resumes
                            </a>
                        ) }
                    </div>
                </div>

                { hasApplications ? (
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-2 lg:grid-cols-1">
                        { applications.map( ( application ) => (
                            <JobApplicationCard
                                key={ application.id }
                                application={ application }
                                statuses={ statuses }
                            />
                        ) ) }
                    </div>
                ) : (
                    <div className="flex flex-1 flex-col items-center justify-center space-y-4">
                        <div className="rounded-full bg-muted p-4">
                            <User className="h-12 w-12 text-muted-foreground" />
                        </div>
                        <div className="space-y-1 text-center">
                            <h3 className="text-lg font-semibold">
                                { hasSelectedJob ? 'No applications yet' : 'Select a job' }
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                { hasSelectedJob
                                    ? 'Applications will appear here once candidates apply for this position.'
                                    : 'Please select a job to view its applications.' }
                            </p>
                        </div>
                    </div>
                ) }
            </div>
        </AppLayout>
    );
}
