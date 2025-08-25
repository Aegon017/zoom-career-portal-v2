import JobseekerCard from '@/components/employer/jobseeker-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/employer-layout';
import { BreadcrumbItem, Opening, User } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Search, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

interface UsersResponse {
    data: User[];
    total: number;
    next_page_url: string | null;
}

const breadcrumbs: BreadcrumbItem[] = [ { title: 'Jobseekers', href: '/employer/jobseekers' } ];

interface Props {
    initialUsers: UsersResponse;
    jobs: Opening[];
}

export default function JobseekersListing( { initialUsers, jobs }: Props ) {
    const [ users, setUsers ] = useState<User[]>( initialUsers.data );
    const [ total, setTotal ] = useState( initialUsers.total );
    const [ nextPageUrl, setNextPageUrl ] = useState( initialUsers.next_page_url );
    const [ loading, setLoading ] = useState( false );
    const [ search, setSearch ] = useState( '' );
    const [ selectedJobId, setSelectedJobId ] = useState<string>( '' );

    const debounceRef = useRef<NodeJS.Timeout | null>( null );

    const clearFilters = () => {
        setSearch( '' );
        setSelectedJobId( '' );
    };

    const hasFilters = search !== '' || selectedJobId !== '';

    const fetchFilteredUsers = useCallback( ( query: { search?: string; job_id?: string } ) => {
        setLoading( true );
        router.get( '/employer/jobseekers', query, {
            preserveState: true,
            replace: true,
            only: [ 'initialUsers' ],
            onSuccess: ( page ) => {
                const data = page.props.initialUsers as UsersResponse;
                setUsers( data.data );
                setTotal( data.total );
                setNextPageUrl( data.next_page_url );
                setLoading( false );
            },
            onError: () => {
                setLoading( false );
            }
        } );
    }, [] );

    useEffect( () => {
        if ( debounceRef.current ) {
            clearTimeout( debounceRef.current );
        }

        debounceRef.current = setTimeout( () => {
            fetchFilteredUsers( {
                search: search || undefined,
                job_id: selectedJobId || undefined
            } );
        }, 500 );

        return () => {
            if ( debounceRef.current ) {
                clearTimeout( debounceRef.current );
            }
        };
    }, [ search, selectedJobId, fetchFilteredUsers ] );

    const loadMore = useCallback( () => {
        if ( !nextPageUrl || loading ) return;

        setLoading( true );
        router.get(
            nextPageUrl,
            { search, job_id: selectedJobId },
            {
                preserveScroll: true,
                preserveState: true,
                only: [ 'initialUsers' ],
                onSuccess: ( page ) => {
                    const data = page.props.initialUsers as UsersResponse;
                    setUsers( prev => [ ...prev, ...data.data ] );
                    setNextPageUrl( data.next_page_url );
                    setLoading( false );
                },
                onError: () => {
                    setLoading( false );
                }
            },
        );
    }, [ nextPageUrl, loading, search, selectedJobId ] );

    // Get selected job title for display
    const selectedJob = jobs.find( job => job.id === parseInt( selectedJobId ) )?.title;

    return (
        <AppLayout breadcrumbs={ breadcrumbs }>
            <Head title="Jobseekers" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Card className="mb-6 rounded-none border-0 border-b-2 p-0 shadow-none">
                    <CardContent className="space-y-4 p-0 pb-4">
                        <div className="flex flex-col gap-2 sm:flex-row">
                            <div className="relative flex-1">
                                <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                                <Input
                                    placeholder="Search candidates..."
                                    className="pl-10"
                                    value={ search }
                                    onChange={ ( e ) => setSearch( e.target.value ) }
                                    disabled={ loading }
                                />
                                { search && (
                                    <button
                                        onClick={ () => setSearch( '' ) }
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                ) }
                            </div>
                            <Select
                                value={ selectedJobId }
                                onValueChange={ setSelectedJobId }
                                disabled={ loading }
                            >
                                <SelectTrigger className="sm:w-60">
                                    <SelectValue placeholder="Filter by job" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="sdf">All Jobs</SelectItem>
                                    { jobs.map( ( job ) => (
                                        <SelectItem key={ job.id } value={ String( job.id ) }>
                                            { job.title }
                                        </SelectItem>
                                    ) ) }
                                </SelectContent>
                            </Select>
                            { hasFilters && (
                                <Button
                                    variant="ghost"
                                    onClick={ clearFilters }
                                    disabled={ loading }
                                    className="flex items-center gap-2"
                                >
                                    <X className="h-4 w-4" />
                                    Clear filters
                                </Button>
                            ) }
                        </div>
                    </CardContent>
                </Card>

                <div className="mx-auto flex w-full flex-col md:w-2xl">
                    { users.length > 0 && (
                        <div className="mb-4 flex justify-between">
                            <span className="text-muted-foreground text-sm">
                                Showing { users.length } of { total } candidates
                            </span>
                            { ( search || selectedJob ) && (
                                <div className="flex items-center gap-2">
                                    { search && (
                                        <span className="text-muted-foreground text-sm">
                                            Search: "{ search }"
                                        </span>
                                    ) }
                                    { selectedJob && (
                                        <span className="text-muted-foreground text-sm">
                                            Job: { selectedJob }
                                        </span>
                                    ) }
                                </div>
                            ) }
                        </div>
                    ) }

                    { users.length === 0 ? (
                        <div className="text-muted-foreground py-12 text-center text-sm">
                            { loading ? 'Searching...' : 'No candidates found matching your criteria' }
                        </div>
                    ) : (
                        <div className="space-y-4">
                            { users.map( ( user ) => (
                                <JobseekerCard
                                    key={ user.id }
                                    user={ user }
                                />
                            ) ) }
                        </div>
                    ) }
                </div>

                { nextPageUrl && (
                    <div className="mt-6 flex justify-center">
                        <Button
                            variant="outline"
                            onClick={ loadMore }
                            disabled={ loading }
                        >
                            { loading ? 'Loading...' : 'Load More' }
                        </Button>
                    </div>
                ) }
            </div>
        </AppLayout>
    );
}