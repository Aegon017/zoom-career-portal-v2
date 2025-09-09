import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { Head, router } from '@inertiajs/react';
import { Download, User, Loader2, Filter, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import axios from 'axios';

import JobApplicationCard from '@/components/job-application-card';
import AppLayout from '@/layouts/employer-layout';
import { Application, BreadcrumbItem, Opening, Option } from '@/types';
import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import TextEditor from '@/components/text-editor';
import { Form } from '@/components/ui/form';
import { SelectPopoverField } from '@/components/select-popover-field';

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
    exportUrl?: string;
}

interface JobOption extends Option {
    value: string;
    label: string;
}

interface FilterFormValues {
    status: string;
    job_id: string;
    skill: string;
}

interface JobApplicationsFilterProps {
    jobOptions: JobOption[];
    skills: string[];
    statuses: Option[];
    defaultValue?: number;
    selectedSkill?: string;
}

const DownloadResumesButton = ( { jobId, skill, status }: {
    jobId: string;
    skill: string;
    status: string
} ) => {
    const [ isDownloading, setIsDownloading ] = useState( false );

    const handleDownload = useCallback( async () => {
        if ( !jobId ) return;

        setIsDownloading( true );
        try {
            const response = await axios.get( '/employer/applications/download-resumes', {
                params: { job_id: jobId, skill: skill || undefined, status: status || undefined },
                responseType: 'blob'
            } );

            const url = window.URL.createObjectURL( new Blob( [ response.data ] ) );
            const link = document.createElement( 'a' );
            link.href = url;
            link.setAttribute( 'download', 'resumes.zip' );
            document.body.appendChild( link );
            link.click();
            link.remove();
        } catch ( error ) {
            console.error( 'Download failed:', error );
        } finally {
            setIsDownloading( false );
        }
    }, [ jobId, skill, status ] );

    return (
        <Button variant="secondary" onClick={ handleDownload } disabled={ isDownloading }>
            { isDownloading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
                <Download className="mr-2 h-4 w-4" />
            ) }
            Download Resumes
        </Button>
    );
};

const MessageDialog = ( {
    jobId,
    open,
    onOpenChange,
    onSubmit
}: {
    jobId: string;
    open: boolean;
    onOpenChange: ( open: boolean ) => void;
    onSubmit: ( data: { subject: string; message: string } ) => void;
} ) => {
    const [ subject, setSubject ] = useState( '' );
    const [ message, setMessage ] = useState( '' );

    const handleSubmit = ( e: React.FormEvent ) => {
        e.preventDefault();
        onSubmit( { subject, message } );
    };

    return (
        <Dialog open={ open } onOpenChange={ onOpenChange }>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Message Shortlisted Candidates</DialogTitle>
                    <DialogDescription>
                        Send a message to all shortlisted candidates for this job.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={ handleSubmit } className="space-y-4">
                    <Input
                        value={ subject }
                        onChange={ ( e ) => setSubject( e.target.value ) }
                        placeholder="Subject"
                        required
                    />
                    <TextEditor
                        value={ message }
                        onChange={ setMessage }
                        placeholder="Type your message..."
                        disabled={ false }
                    />
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button
                            type="submit"
                            disabled={ !subject.trim() || !message.trim() }
                        >
                            Send
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

const JobApplicationsFilter = ( {
    jobOptions,
    defaultValue,
    skills,
    statuses,
    selectedSkill,
}: JobApplicationsFilterProps ) => {
    const [ isMessageOpen, setIsMessageOpen ] = useState( false );
    const hasMounted = useRef( false );

    const form = useForm<FilterFormValues>( {
        defaultValues: {
            status: '',
            job_id: defaultValue?.toString() ?? '',
            skill: selectedSkill ?? '',
        },
    } );

    const { control, watch, reset } = form;
    const [ jobId, skill, status ] = watch( [ 'job_id', 'skill', 'status' ] );
    const hasFilters = jobId || skill || status;

    // Memoized options
    const skillOptions = useMemo( () => [
        { value: '', label: 'All Skills' },
        ...skills.map( s => ( { value: s, label: s } ) )
    ], [ skills ] );

    const statusOptions = useMemo( () => [
        { value: '', label: 'All Statuses' },
        ...statuses.map( s => ( { value: s.value, label: s.label } ) )
    ], [ statuses ] );

    // Filter submission handler
    const submitFilters = useCallback( ( data: FilterFormValues ) => {
        router.get( '/employer/applications', {
            job_id: data.job_id || undefined,
            skill: data.skill || undefined,
            status: data.status || undefined,
        }, {
            preserveScroll: true,
            preserveState: true,
            replace: true,
            only: [ 'applications', 'skills', 'status' ],
        } );
    }, [] );

    // Message submission handler
    const handleMessageSubmit = useCallback( ( { subject, message }: { subject: string; message: string } ) => {
        router.post( `/employer/jobs/${ jobId }/shortlisted/message`,
            { message, subject },
            {
                onSuccess: () => setIsMessageOpen( false ),
                onError: () => alert( 'Failed to send message' ),
            }
        );
    }, [ jobId ] );

    // Debounced filter effect
    useEffect( () => {
        if ( hasMounted.current ) {
            const timeoutId = setTimeout( () => {
                submitFilters( { job_id: jobId, skill, status } );
            }, 300 );
            return () => clearTimeout( timeoutId );
        }
        hasMounted.current = true;
    }, [ jobId, skill, status, submitFilters ] );

    // Clear filters
    const clearFilters = useCallback( () => reset( { job_id: '', skill: '', status: '' } ), [ reset ] );

    return (
        <div className="p-4 grid gap-4 grid-cols-1">
            <Form { ...form }>
                <SelectPopoverField
                    control={ control }
                    name="job_id"
                    options={ jobOptions }
                    placeholder="Select job"
                    label="Job"
                />

                { jobId && (
                    <>
                        <SelectPopoverField
                            control={ control }
                            name="skill"
                            options={ skillOptions }
                            placeholder="Select skill"
                            label="Skill"
                        />
                        <SelectPopoverField
                            control={ control }
                            name="status"
                            options={ statusOptions }
                            placeholder="Select status"
                            label="Status"
                        />
                        <Dialog open={ isMessageOpen } onOpenChange={ setIsMessageOpen }>
                            <DialogTrigger asChild>
                                <Button variant="secondary">Message Shortlisted</Button>
                            </DialogTrigger>
                            <MessageDialog
                                jobId={ jobId }
                                open={ isMessageOpen }
                                onOpenChange={ setIsMessageOpen }
                                onSubmit={ handleMessageSubmit }
                            />
                        </Dialog>

                        <DownloadResumesButton
                            jobId={ jobId }
                            skill={ skill }
                            status={ status }
                        />
                    </>
                ) }

                { hasFilters && (
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={ clearFilters }
                        className="text-muted-foreground hover:text-foreground mt-1 sm:mt-0"
                    >
                        <X className="mr-1 h-4 w-4" />
                        Clear
                    </Button>
                ) }
            </Form>
        </div>
    );
};

export default function ApplicationsIndex( {
    jobs,
    job_id,
    applications = [], // Default value for safety
    statuses,
    skills,
    exportUrl
}: Props ) {
    // Memoized derived values for performance
    const hasApplications = useMemo( () => applications.length > 0, [ applications ] );
    const hasSelectedJob = useMemo( () => Boolean( job_id ), [ job_id ] );
    const [ isExporting, setIsExporting ] = useState( false );

    // Memoized job options to prevent unnecessary recalculations
    const jobOptions = useMemo( () => (
        jobs.map( job => ( {
            value: String( job.id ),
            label: job.title,
        } ) )
    ), [ jobs ] );

    const handleExport = () => {
        if ( !exportUrl ) return;

        setIsExporting( true );
        try {
            // Improved download method using hidden anchor
            const anchor = document.createElement( 'a' );
            anchor.href = exportUrl;
            anchor.download = 'applications.xlsx';
            anchor.style.display = 'none';
            document.body.appendChild( anchor );
            anchor.click();
            document.body.removeChild( anchor );
        } catch ( error ) {
            console.error( 'Export failed:', error );
        } finally {
            setIsExporting( false );
        }
    };

    return (
        <AppLayout breadcrumbs={ breadcrumbs }>
            <Head title="Applications" />
            <div className="flex flex-1 flex-col gap-4 p-4 px-6 md:px-4 rounded-xl">
                <div className="flex flex-row items-center justify-between">
                    <h1 className="text-2xl font-semibold">Candidate Applications</h1>
                    <div className="flex items-center gap-2">
                        { exportUrl && (
                            <Button
                                variant="outline"
                                onClick={ handleExport }
                                disabled={ isExporting }
                                aria-busy={ isExporting }
                                className="flex items-center gap-2"
                            >
                                { isExporting ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        <span>Exporting...</span>
                                    </>
                                ) : (
                                    <>
                                        <Download className="h-4 w-4" />
                                        <span>Export</span>
                                    </>
                                ) }
                            </Button>
                        ) }
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="outline"><Filter /></Button>
                            </SheetTrigger>
                            <SheetContent>
                                <SheetHeader>
                                    <SheetTitle>Filter</SheetTitle>
                                    <SheetDescription>
                                        Add Filters
                                    </SheetDescription>
                                </SheetHeader>
                                <JobApplicationsFilter
                                    statuses={ statuses }
                                    skills={ skills }
                                    defaultValue={ job_id ? job_id : undefined }
                                    jobOptions={ jobOptions }
                                />
                                <SheetFooter>
                                    <SheetClose asChild>
                                        <Button variant="outline">Close</Button>
                                    </SheetClose>
                                </SheetFooter>
                            </SheetContent>
                        </Sheet>
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
                    <div className="flex flex-1 flex-col items-center justify-center gap-4 py-8">
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