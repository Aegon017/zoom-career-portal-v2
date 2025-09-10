import { Head, router } from '@inertiajs/react';
import axios from 'axios';
import { Download, FileUp, Filter, Loader2, User, X } from 'lucide-react';
import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ComboboxField } from '@/components/combobox-field';
import JobApplicationCard from '@/components/job-application-card';
import TextEditor from '@/components/text-editor';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
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

const breadcrumbs: BreadcrumbItem[] = [
	{
		title: 'Applications',
		href: '/employer/applications',
	},
];

interface Props {
	jobs: Opening[];
	job_id?: number;
	status?: string;
	applications: Application[];
	statuses: Option[];
}

interface FilterFormValues {
	status: string;
	job_id: string;
}

const FilterForm = ( {
	jobOptions,
	statuses,
	defaultJobId,
	defaultStatus,
	onFilterChange,
}: {
	jobOptions: Option[];
	statuses: Option[];
	defaultJobId?: string;
	defaultStatus?: string;
	onFilterChange: ( data: FilterFormValues ) => void;
} ) => {
	const form = useForm<FilterFormValues>( {
		defaultValues: {
			status: defaultStatus ?? '',
			job_id: defaultJobId ?? '',
		},
	} );

	const { control, watch, reset } = form;
	const [ jobId, status ] = watch( [ 'job_id', 'status' ] );
	const timeoutRef = useRef<number | null>( null );

	const hasFilters = jobId || status;

	const statusOptions = useMemo(
		() => [
			{ value: '', label: 'All Statuses' },
			...statuses,
		],
		[ statuses ]
	);

	const clearFilters = useCallback( () => {
		reset( { job_id: '', status: '' } );
	}, [ reset ] );

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

const MessageDialog = ( {
	selectedJobId,
	isOpen,
	onOpenChange,
}: {
	selectedJobId: string;
	isOpen: boolean;
	onOpenChange: ( open: boolean ) => void;
} ) => {
	const [ subject, setSubject ] = useState( '' );
	const [ message, setMessage ] = useState( '' );

	const handleMessageSubmit = useCallback(
		( e: React.FormEvent ) => {
			e.preventDefault();
			router.post(
				`/employer/jobs/${ selectedJobId }/shortlisted/message`,
				{ message, subject },
				{
					onSuccess: () => onOpenChange( false ),
					onError: () => alert( 'Failed to send message' ),
				}
			);
		},
		[ selectedJobId, message, subject, onOpenChange ]
	);

	return (
		<Dialog open={ isOpen } onOpenChange={ onOpenChange }>
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

const ApplicationsHeader = ( {
	selectedJobId,
	selectedStatus,
	filterCount,
	jobOptions,
	statuses,
	defaultJobId,
	defaultStatus,
	onFilterChange,
	onExport,
	isExporting,
	onDownloadSelectedResumes,
	isDownloadingResumes,
	selectedCount,
	totalCount,
	onSelectAll,
	allSelected,
}: {
	selectedJobId: string;
	selectedStatus: string;
	filterCount: number;
	jobOptions: Option[];
	statuses: Option[];
	defaultJobId: string;
	defaultStatus: string;
	onFilterChange: ( data: FilterFormValues ) => void;
	onExport: () => void;
	isExporting: boolean;
	onDownloadSelectedResumes: () => void;
	isDownloadingResumes: boolean;
	selectedCount: number;
	totalCount: number;
	onSelectAll: ( checked: boolean ) => void;
	allSelected: boolean;
} ) => {
	const [ isMessageOpen, setIsMessageOpen ] = useState( false );
	const selectAllId = useId();

	return (
		<div className="flex flex-col gap-4">
			<div className="flex flex-row items-center justify-between">
				<h1 className="text-2xl font-semibold">Candidate Applications</h1>
				<div className="flex items-center gap-2">
					{ selectedJobId && (
						<>
							<Button
								variant="outline"
								onClick={ onExport }
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
										<FileUp className="h-4 w-4" />
										<span>Export</span>
									</>
								) }
							</Button>

							<Button variant="secondary" onClick={ () => setIsMessageOpen( true ) }>
								Message Shortlisted
							</Button>

							<MessageDialog
								selectedJobId={ selectedJobId }
								isOpen={ isMessageOpen }
								onOpenChange={ setIsMessageOpen }
							/>
						</>
					) }

					<Sheet>
						<SheetTrigger asChild>
							<Button variant="outline" type="button" className="relative">
								<Filter className="h-4 w-4 mr-2" />
								Filter
								{ filterCount > 0 && (
									<span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
										{ filterCount }
									</span>
								) }
							</Button>
						</SheetTrigger>
						<SheetContent className="w-full sm:max-w-md">
							<SheetHeader className="mb-4">
								<SheetTitle>Filter Applications</SheetTitle>
								<SheetDescription>
									Filter applications by job and status
								</SheetDescription>
							</SheetHeader>
							<div className="p-4">
								<FilterForm
									jobOptions={ jobOptions }
									statuses={ statuses }
									defaultJobId={ defaultJobId }
									defaultStatus={ defaultStatus }
									onFilterChange={ onFilterChange }
								/>
							</div>
							<SheetFooter className="mt-4">
								<SheetClose asChild>
									<Button variant="outline">Close</Button>
								</SheetClose>
							</SheetFooter>
						</SheetContent>
					</Sheet>
				</div>
			</div>

			{ selectedJobId && totalCount > 0 && (
				<div className="flex items-center justify-between bg-muted p-3 rounded-lg">
					<div className="flex items-center space-x-2">
						<Checkbox
							id={ selectAllId }
							checked={ allSelected }
							onCheckedChange={ onSelectAll }
							className="h-5 w-5 rounded-md border-2 data-[state=checked]:bg-primary"
						/>
						<label
							htmlFor={ selectAllId }
							className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
						>
							Select all ({ selectedCount } selected of { totalCount })
						</label>
					</div>

					<Button
						onClick={ onDownloadSelectedResumes }
						disabled={ isDownloadingResumes || selectedCount === 0 }
						className="flex items-center gap-2"
					>
						{ isDownloadingResumes ? (
							<Loader2 className="h-4 w-4 animate-spin" />
						) : (
							<Download className="h-4 w-4" />
						) }
						Download Selected ({ selectedCount })
					</Button>
				</div>
			) }
		</div>
	);
};

export default function ApplicationsIndex( {
	jobs,
	job_id,
	status,
	applications = [],
	statuses,
}: Props ) {
	const [ selectedJobId, setSelectedJobId ] = useState( job_id ? String( job_id ) : '' );
	const [ selectedStatus, setSelectedStatus ] = useState( status || '' );
	const [ isExporting, setIsExporting ] = useState( false );
	const [ isDownloadingResumes, setIsDownloadingResumes ] = useState( false );
	const [ selectedApplications, setSelectedApplications ] = useState<number[]>( [] );

	useEffect( () => {
		setSelectedJobId( job_id ? String( job_id ) : '' );
		setSelectedStatus( status || '' );
	}, [ job_id, status ] );

	const hasApplications = applications.length > 0;
	const hasSelectedJob = Boolean( selectedJobId );
	const selectedCount = selectedApplications.length;
	const totalCount = applications.length;
	const allSelected = selectedCount === totalCount && totalCount > 0;

	const filterCount = useMemo( () => {
		let count = 0;
		if ( selectedJobId ) count++;
		if ( selectedStatus ) count++;
		return count;
	}, [ selectedJobId, selectedStatus ] );

	const jobOptions = useMemo(
		() => jobs.map( ( job ) => ( { value: String( job.id ), label: job.title } ) ),
		[ jobs ]
	);

	const handleFilterChange = useCallback( ( data: FilterFormValues ) => {
		setSelectedJobId( data.job_id );
		setSelectedStatus( data.status );
		setSelectedApplications( [] ); // Reset selection when filters change
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
				only: [ 'applications' ],
			}
		);
	}, [] );

	const handleExport = useCallback( async () => {
		if ( !selectedJobId ) return;

		setIsExporting( true );
		try {
			const response = await axios.get( '/employer/applications/export', {
				params: { job_id: selectedJobId, status: selectedStatus || undefined },
				responseType: 'blob',
			} );

			const url = window.URL.createObjectURL( new Blob( [ response.data ] ) );
			const link = document.createElement( 'a' );
			link.href = url;
			link.setAttribute( 'download', 'applications.xlsx' );
			document.body.appendChild( link );
			link.click();
			link.remove();
			window.URL.revokeObjectURL( url );
		} catch ( error ) {
			console.error( 'Export failed:', error );
		} finally {
			setIsExporting( false );
		}
	}, [ selectedJobId, selectedStatus ] );

	const handleDownloadSelectedResumes = useCallback( async () => {
		if ( selectedApplications.length === 0 ) return;

		setIsDownloadingResumes( true );
		try {
			const response = await axios.get( `/employer/jobs/${ selectedJobId }/applications/resumes/download-selected`, {
				params: {
					application_ids: selectedApplications,
					status: selectedStatus || undefined
				},
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
			setIsDownloadingResumes( false );
		}
	}, [ selectedApplications, selectedJobId, selectedStatus ] );

	const handleSelectApplication = useCallback( ( id: number, selected: boolean ) => {
		setSelectedApplications( prev =>
			selected ? [ ...prev, id ] : prev.filter( appId => appId !== id )
		);
	}, [] );

	const handleSelectAll = useCallback( ( checked: boolean ) => {
		if ( checked ) {
			setSelectedApplications( applications.map( app => app.id ) );
		} else {
			setSelectedApplications( [] );
		}
	}, [ applications ] );

	return (
		<AppLayout breadcrumbs={ breadcrumbs }>
			<Head title="Applications" />
			<div className="flex flex-1 flex-col gap-4 p-4 px-6 md:px-4 rounded-xl">
				<ApplicationsHeader
					selectedJobId={ selectedJobId }
					selectedStatus={ selectedStatus }
					filterCount={ filterCount }
					jobOptions={ jobOptions }
					statuses={ statuses }
					defaultJobId={ selectedJobId }
					defaultStatus={ selectedStatus }
					onFilterChange={ handleFilterChange }
					onExport={ handleExport }
					isExporting={ isExporting }
					onDownloadSelectedResumes={ handleDownloadSelectedResumes }
					isDownloadingResumes={ isDownloadingResumes }
					selectedCount={ selectedCount }
					totalCount={ totalCount }
					onSelectAll={ handleSelectAll }
					allSelected={ allSelected }
				/>

				{ hasApplications ? (
					<div className="grid gap-4 lg:grid-cols-2">
						{ applications.map( ( application ) => (
							<JobApplicationCard
								key={ application.id }
								application={ application }
								statuses={ statuses }
								selectable={ true }
								selected={ selectedApplications.includes( application.id ) }
								onSelect={ handleSelectApplication }
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