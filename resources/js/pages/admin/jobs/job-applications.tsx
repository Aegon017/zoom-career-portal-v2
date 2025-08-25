import { Head, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Download, User, X, Loader2, FileUp, Filter } from 'lucide-react';

import JobApplicationCard from '@/components/job-application-card';
import MultipleSelector from '@/components/multiple-selector';
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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import AppLayout from '@/layouts/app-layout';
import { Application, BreadcrumbItem, Opening, Option } from '@/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

const formSchema = z.object( {
    users: z
        .array(
            z.object( {
                value: z.string(),
                label: z.string(),
            } ),
        )
        .min( 1, { message: 'Please select at least one user.' } ),
} );

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Jobs', href: '/admin/jobs' },
    { title: 'Applications', href: '' },
];

// Generate range options like 1-10, 10-20, etc.
const matchingScoreOptions = [
    { value: '1-10', label: '1-10%' },
    { value: '10-20', label: '10-20%' },
    { value: '20-30', label: '20-30%' },
    { value: '30-40', label: '30-40%' },
    { value: '40-50', label: '40-50%' },
    { value: '50-60', label: '50-60%' },
    { value: '60-70', label: '60-70%' },
    { value: '70-80', label: '70-80%' },
    { value: '80-90', label: '80-90%' },
    { value: '90-100', label: '90-100%' },
];

interface Props {
    applications: Application[];
    statuses: Option[];
    users: Option[];
    job: Opening;
    exportUrl?: string;
    filters: {
        status?: string;
        matching_score_range?: string;
    };
}

export default function JobApplications( { applications, statuses, users, job, exportUrl, filters: initialFilters }: Props ) {
    const [ open, setOpen ] = useState( false );
    const [ loading, setLoading ] = useState( false );
    const [ isExporting, setIsExporting ] = useState( false );
    const [ activeFilters, setActiveFilters ] = useState( initialFilters );

    const form = useForm<z.infer<typeof formSchema>>( {
        defaultValues: { users: [] },
    } );

    // Update active filters when initialFilters change
    useEffect( () => {
        setActiveFilters( initialFilters );
    }, [ initialFilters ] );

    const onSubmit = async ( values: z.infer<typeof formSchema> ) => {
        setLoading( true );
        const userIds = values.users.map( ( user ) => user.value );

        try {
            await router.post(
                `/admin/jobs/${ job.id }/applications`,
                { user_ids: userIds },
                {
                    onSuccess: () => {
                        setOpen( false );
                        form.reset();
                    },
                }
            );
        } finally {
            setLoading( false );
        }
    };

    const handleExport = () => {
        if ( !exportUrl ) return;

        setIsExporting( true );

        // Add filters to export URL
        const params = new URLSearchParams();
        if ( activeFilters.status ) params.append( 'status', activeFilters.status );
        if ( activeFilters.matching_score_range ) params.append( 'matching_score_range', activeFilters.matching_score_range );

        const exportWithFilters = `${ exportUrl }?${ params.toString() }`;

        const link = document.createElement( 'a' );
        link.href = exportWithFilters;
        link.download = `${ job.title.replace( /\s+/g, '_' ) }_applications.xlsx`;
        document.body.appendChild( link );
        link.click();
        document.body.removeChild( link );

        setIsExporting( false );
    };

    const handleFilterChange = ( key: string, value: string ) => {
        const newFilters = { ...activeFilters, [ key ]: value };
        setActiveFilters( newFilters );
        applyFilters( newFilters );
    };

    const clearFilters = () => {
        const newFilters = {};
        setActiveFilters( newFilters );
        applyFilters( newFilters );
    };

    const applyFilters = ( filters: Record<string, string> ) => {
        router.get(
            `/admin/jobs/${ job.id }/applications`,
            { ...filters },
            { preserveState: true }
        );
    };

    const hasActiveFilters = Object.values( activeFilters ).some(
        value => value !== undefined && value !== ''
    );

    return (
        <AppLayout breadcrumbs={ breadcrumbs }>
            <Head title="Applications" />

            <div className="flex h-full flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Applications for { job.title }</h1>

                    <div className="flex items-center gap-2">
                        {/* Export Button */ }
                        { exportUrl && (
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
                                        <FileUp className="h-4 w-4" />
                                        <span>Export</span>
                                    </>
                                ) }
                            </Button>
                        ) }

                        <Dialog open={ open } onOpenChange={ setOpen }>
                            <DialogTrigger asChild>
                                <Button variant="default" className="ml-auto">
                                    Apply for Candidates
                                </Button>
                            </DialogTrigger>

                            <DialogContent className="sm:max-w-[425px]">
                                <Form { ...form }>
                                    <form onSubmit={ form.handleSubmit( onSubmit ) }>
                                        <DialogHeader>
                                            <DialogTitle>Apply for Job</DialogTitle>
                                            <DialogDescription>
                                                Select candidates to apply for this position.
                                            </DialogDescription>
                                        </DialogHeader>

                                        <div className="grid gap-4 py-4">
                                            <FormField
                                                control={ form.control }
                                                name="users"
                                                render={ ( { field } ) => (
                                                    <FormItem>
                                                        <FormLabel>Select Candidates</FormLabel>
                                                        <FormControl>
                                                            <MultipleSelector
                                                                options={ users }
                                                                value={ field.value }
                                                                onChange={ field.onChange }
                                                                placeholder="Search candidates..."
                                                                emptyIndicator={
                                                                    <p className="w-full text-center text-sm text-muted-foreground">
                                                                        No candidates found
                                                                    </p>
                                                                }
                                                                hidePlaceholderWhenSelected
                                                                creatable={ false }
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                ) }
                                            />
                                        </div>

                                        <DialogFooter>
                                            <DialogClose asChild>
                                                <Button variant="outline" type="button" disabled={ loading }>
                                                    Cancel
                                                </Button>
                                            </DialogClose>
                                            <Button type="submit" disabled={ loading }>
                                                { loading ? 'Applying...' : 'Apply' }
                                            </Button>
                                        </DialogFooter>
                                    </form>
                                </Form>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                {/* Filters Section */ }
                <div className="flex flex-col gap-4 rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Filter className="h-4 w-4" />
                            <h3 className="font-semibold">Filters</h3>
                        </div>
                        { hasActiveFilters && (
                            <Button variant="ghost" onClick={ clearFilters } className="h-8 px-2 lg:px-3">
                                Clear filters
                                <X className="ml-2 h-4 w-4" />
                            </Button>
                        ) }
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Status</label>
                            <Select
                                value={ activeFilters.status || '' }
                                onValueChange={ ( value ) => handleFilterChange( 'status', value ) }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="All Statuses" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Statuses</SelectItem>
                                    { statuses.map( ( status ) => (
                                        <SelectItem key={ status.value } value={ status.value }>
                                            { status.label }
                                        </SelectItem>
                                    ) ) }
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Matching Score Range</label>
                            <Select
                                value={ activeFilters.matching_score_range || '' }
                                onValueChange={ ( value ) => handleFilterChange( 'matching_score_range', value ) }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Any Range" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Any Range</SelectItem>
                                    { matchingScoreOptions.map( ( option ) => (
                                        <SelectItem key={ option.value } value={ option.value }>
                                            { option.label }
                                        </SelectItem>
                                    ) ) }
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Active filters badges */ }
                    { hasActiveFilters && (
                        <div className="flex flex-wrap gap-2 pt-2">
                            { activeFilters.status && (
                                <Badge variant="secondary" className="gap-1 py-1">
                                    Status: { statuses.find( s => s.value === activeFilters.status )?.label || activeFilters.status }
                                    <X
                                        className="h-3 w-3 cursor-pointer"
                                        onClick={ () => handleFilterChange( 'status', '' ) }
                                    />
                                </Badge>
                            ) }
                            { activeFilters.matching_score_range && (
                                <Badge variant="secondary" className="gap-1 py-1">
                                    Score: { matchingScoreOptions.find( s => s.value === activeFilters.matching_score_range )?.label }
                                    <X
                                        className="h-3 w-3 cursor-pointer"
                                        onClick={ () => handleFilterChange( 'matching_score_range', '' ) }
                                    />
                                </Badge>
                            ) }
                        </div>
                    ) }
                </div>

                { applications?.length > 0 ? (
                    <div className="grid gap-4 lg:grid-cols-2">
                        { applications.map( ( application, index ) => (
                            <JobApplicationCard
                                key={ index }
                                application={ application }
                                statuses={ statuses }
                                message={ false }
                            />
                        ) ) }
                    </div>
                ) : (
                    <div className="flex h-full flex-col items-center justify-center space-y-4">
                        <div className="rounded-full bg-muted p-4">
                            <User className="h-12 w-12 text-muted-foreground" />
                        </div>
                        <div className="space-y-1 text-center">
                            <h3 className="text-lg font-semibold">No applications yet</h3>
                            <p className="text-sm text-muted-foreground">
                                Applications will appear here once candidates apply for this position.
                            </p>
                        </div>
                    </div>
                ) }
            </div>
        </AppLayout>
    );
}