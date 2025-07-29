import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { User } from 'lucide-react';

import JobApplicationCard from '@/components/job-application-card';
import { JobApplicationsFilter } from '@/components/job-applications-filter';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/employer-layout';
import { Application, BreadcrumbItem, Opening, Option } from '@/types';
import { Input } from '@/components/ui/input';
import TextEditor from '@/components/text-editor';

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
    const [ openMessage, setOpenMessage ] = useState( false );
    const [ message, setMessage ] = useState( '' );
    const [ subject, setSubject ] = useState( '' );

    const hasApplications = applications?.length > 0;
    const hasSelectedJob = Boolean( job_id );

    const handleMessageSubmit = ( e: React.FormEvent ) => {
        e.preventDefault();
        if ( !job_id ) return;

        router.post(
            `/employer/jobs/${ job_id }/shortlisted/message`,
            { message, subject },
            {
                onSuccess: () => {
                    setMessage( '' );
                    setSubject( '' );
                    setOpenMessage( false );
                },
            }
        );
    };

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

                        { hasSelectedJob && (
                            <Dialog open={ openMessage } onOpenChange={ setOpenMessage }>
                                <DialogTrigger asChild>
                                    <Button variant="secondary">Message Shortlisted</Button>
                                </DialogTrigger>

                                <DialogContent className="sm:max-w-2xl">
                                    <DialogHeader>
                                        <DialogTitle>Message Shortlisted Candidates</DialogTitle>
                                        <DialogDescription>
                                            Send a message to all shortlisted candidates for this job.
                                        </DialogDescription>
                                    </DialogHeader>

                                    <form onSubmit={ handleMessageSubmit } className="space-y-4">
                                        <Input
                                            value={ subject }
                                            type='text'
                                            onChange={ ( e ) => setSubject( e.target.value ) }
                                            placeholder="Write your subject here..."
                                            required />
                                        <TextEditor
                                            disabled={ false }
                                            value={ message }
                                            onChange={ ( value ) => setMessage( value ) }
                                            placeholder="Type your message..."
                                        />
                                        <DialogFooter>
                                            <DialogClose asChild>
                                                <Button variant="outline" type="button">Cancel</Button>
                                            </DialogClose>
                                            <Button type="submit">Send</Button>
                                        </DialogFooter>
                                    </form>
                                </DialogContent>
                            </Dialog>
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
