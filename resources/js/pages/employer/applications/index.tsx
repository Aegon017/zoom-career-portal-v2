import { Head, router } from '@inertiajs/react';
import axios from 'axios';
import { Download, Filter, Loader2, User, X } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

import JobApplicationCard from '@/components/job-application-card';
import TextEditor from '@/components/text-editor';
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
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '@/components/ui/sheet';
import AppLayout from '@/layouts/employer-layout';
import type { Application, BreadcrumbItem, Opening, Option } from '@/types';
import { ComboboxField } from '@/components/combobox-field';

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
	exportUrl?: string;
}

interface JobOption extends Option {
	value: string;
	label: string;
}

interface FilterFormValues {
	status: string;
	job_id: string;
}

interface JobApplicationsFilterProps {
	jobOptions: JobOption[];
	statuses: Option[];
	defaultValue?: number;
}

// Reusable Download Resumes Button Component
const DownloadResumesButton = ( {
	jobId,
	status,
}: {
	jobId: string;
	status: string;
} ) => {
	const [ isDownloading, setIsDownloading ] = useState( false );

	const handleDownload = useCallback( async () => {
		if ( !jobId ) return;

		setIsDownloading( true );
		try {
			const response = await axios.get( '/employer/applications/download-resumes', {
				params: { job_id: jobId, status: status || undefined },
				responseType: 'blob',
			} );

			const url = window.URL.createObjectURL( new Blob( [ response.data ] ) );
			const link = document.createElement( 'a' );
			link.href = url;
			link.setAttribute( 'download', 'resumes.zip' );
			document.body.appendChild( link );
			link.click();
			link.remove();
			window.URL.revokeObjectURL( url );
		} catch ( error ) {
			console.error( 'Download failed:', error );
		} finally {
			setIsDownloading( false );
		}
	}, [ jobId, status ] );

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

// Reusable Message Dialog Component
const MessageDialog = ( {
	open,
	onOpenChange,
	onSubmit,
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
						<Button type="submit" disabled={ !subject.trim() || !message.trim() }>
							Send
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
};

// Reusable Filter Form Component
const FilterForm = ( {
	jobOptions,
	statuses,
	defaultValue,
	onFilterChange,
}: JobApplicationsFilterProps & { onFilterChange: ( data: FilterFormValues ) => void } ) => {
	const form = useForm<FilterFormValues>( {
		defaultValues: {
			status: '',
			job_id: defaultValue?.toString() ?? '',
		},
	} );

	const { control, watch, reset } = form;
	const [ jobId, status ] = watch( [ 'job_id', 'status' ] );
	const timeoutRef = useRef<number | null>( null );

	// Check if any filters are applied
	const hasFilters = jobId || status;

	// Memoized options
	const statusOptions = useMemo(
		() => [
			{ value: '', label: 'All Statuses' },
			...statuses.map( ( s ) => ( { value: s.value, label: s.label } ) ),
		],
		[ statuses ]
	);

	// Clear all filters
	const clearFilters = useCallback( () => {
		reset( { job_id: '', status: '' } );
	}, [ reset ] );

	// Debounced filter effect
	useEffect( () => {
		if ( timeoutRef.current ) {
			clearTimeout( timeoutRef.current );
		}

		timeoutRef.current = window.setTimeout( () => {
			onFilterChange( { job_id: jobId, status } );
		}, 300 );

		return () => {
			if ( timeoutRef.current ) {
				clearTimeout( timeoutRef.current );
			}
		};
	}, [ jobId, status, onFilterChange ] );

	return (
		<Form { ...form }>
			<form className="space-y-4">
				<FormField
					control={ control }
					name="job_id"
					render={ ( { field } ) => (
						<FormItem>
							<FormLabel>Job</FormLabel>
							<FormControl>
								<ComboboxField
									options={ jobOptions }
									value={ field.value }
									onChange={ field.onChange }
									placeholder="Select job"
									searchPlaceholder="Search jobs..."
									emptyText="No jobs found."
								/>
							</FormControl>
						</FormItem>
					) }
				/>

				{ jobId && (
					<FormField
						control={ control }
						name="status"
						render={ ( { field } ) => (
							<FormItem>
								<FormLabel>Status</FormLabel>
								<FormControl>
									<ComboboxField
										options={ statusOptions }
										value={ field.value }
										onChange={ field.onChange }
										placeholder="Select status"
										searchPlaceholder="Search statuses..."
										emptyText="No statuses found."
									/>
								</FormControl>
							</FormItem>
						) }
					/>
				) }

				{ hasFilters && (
					<Button
						type="button"
						variant="outline"
						size="sm"
						onClick={ clearFilters }
						className="w-full mt-2"
					>
						<X className="mr-2 h-4 w-4" />
						Clear All Filters
					</Button>
				) }
			</form>
		</Form>
	);
};

// Main Filter Component
const JobApplicationsFilter = ( {
	jobOptions,
	defaultValue,
	statuses,
}: JobApplicationsFilterProps ) => {
	const [ isMessageOpen, setIsMessageOpen ] = useState( false );
	const [ selectedJobId, setSelectedJobId ] = useState( '' );
	const [ selectedStatus, setSelectedStatus ] = useState( '' );

	const handleFilterChange = useCallback( ( data: FilterFormValues ) => {
		setSelectedJobId( data.job_id );
		setSelectedStatus( data.status );
		router.get(
			'/employer/applications',
			{
				job_id: data.job_id || undefined,
				status: data.status || undefined,
			},
			{
				preserveScroll: true,
				preserveState: true,
				replace: true,
				only: [ 'applications', 'status' ],
			}
		);
	}, [] );

	const handleMessageSubmit = useCallback(
		( { subject, message }: { subject: string; message: string } ) => {
			router.post(
				`/employer/jobs/${ selectedJobId }/shortlisted/message`,
				{ message, subject },
				{
					onSuccess: () => setIsMessageOpen( false ),
					onError: () => alert( 'Failed to send message' ),
				}
			);
		},
		[ selectedJobId ]
	);

	return (
		<div className="p-4 grid gap-4">
			<FilterForm
				jobOptions={ jobOptions }
				statuses={ statuses }
				defaultValue={ defaultValue }
				onFilterChange={ handleFilterChange }
			/>

			{ selectedJobId && (
				<div className="flex flex-col gap-2 mt-4">
					<Dialog open={ isMessageOpen } onOpenChange={ setIsMessageOpen }>
						<DialogTrigger asChild>
							<Button variant="secondary">Message Shortlisted</Button>
						</DialogTrigger>
						<MessageDialog
							jobId={ selectedJobId }
							open={ isMessageOpen }
							onOpenChange={ setIsMessageOpen }
							onSubmit={ handleMessageSubmit }
						/>
					</Dialog>

					<DownloadResumesButton
						jobId={ selectedJobId }
						status={ selectedStatus }
					/>
				</div>
			) }
		</div>
	);
};

// Empty State Component
const ApplicationsEmptyState = ( { hasSelectedJob }: { hasSelectedJob: boolean } ) => (
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
);

// Export Button Component
const ExportButton = ( { exportUrl }: { exportUrl?: string } ) => {
	const [ isExporting, setIsExporting ] = useState( false );

	const handleExport = () => {
		if ( !exportUrl ) return;

		setIsExporting( true );
		try {
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

	if ( !exportUrl ) return null;

	return (
		<Button
			variant="outline"
			onClick={ handleExport }
			disabled={ isExporting }
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
	);
};

// Main Component
export default function ApplicationsIndex( {
	jobs,
	job_id,
	applications = [],
	statuses,
	exportUrl,
}: Props ) {
	// Memoized derived values for performance
	const hasApplications = useMemo( () => applications.length > 0, [ applications ] );
	const hasSelectedJob = useMemo( () => Boolean( job_id ), [ job_id ] );

	// Memoized job options to prevent unnecessary recalculations
	const jobOptions = useMemo(
		() => jobs.map( ( job ) => ( { value: String( job.id ), label: job.title } ) ),
		[ jobs ]
	);

	return (
		<AppLayout breadcrumbs={ breadcrumbs }>
			<Head title="Applications" />
			<div className="flex flex-1 flex-col gap-4 p-4 px-6 md:px-4 rounded-xl">
				<div className="flex flex-row items-center justify-between">
					<h1 className="text-2xl font-semibold">Candidate Applications</h1>
					<div className="flex items-center gap-2">
						<ExportButton exportUrl={ exportUrl } />
						<Sheet>
							<SheetTrigger asChild>
								<Button variant="outline" type='button'>
									<Filter className="h-4 w-4 mr-2" />
									Filter
								</Button>
							</SheetTrigger>
							<SheetContent className="w-full sm:max-w-md">
								<SheetHeader className="mb-4">
									<SheetTitle>Filter Applications</SheetTitle>
									<SheetDescription>
										Filter applications by job and status
									</SheetDescription>
								</SheetHeader>
								<JobApplicationsFilter
									statuses={ statuses }
									defaultValue={ job_id ? job_id : undefined }
									jobOptions={ jobOptions }
								/>
								<SheetFooter className="mt-4">
									<SheetClose asChild>
										<Button variant="outline">Close</Button>
									</SheetClose>
								</SheetFooter>
							</SheetContent>
						</Sheet>
					</div>
				</div>

				{ hasApplications ? (
					<div className="grid gap-4 lg:grid-cols-2">
						{ applications.map( ( application ) => (
							<JobApplicationCard
								key={ application.id }
								application={ application }
								statuses={ statuses }
							/>
						) ) }
					</div>
				) : (
					<ApplicationsEmptyState hasSelectedJob={ hasSelectedJob } />
				) }
			</div>
		</AppLayout>
	);
}