import JobseekerCard from '@/components/employer/jobseeker-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/employer-layout';
import { BreadcrumbItem, User } from '@/types';
import { Head, router } from '@inertiajs/react';
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
}

export default function JobseekersListing( { initialUsers }: Props ) {
    const [ users, setUsers ] = useState<User[]>( initialUsers.data );
    const [ total, setTotal ] = useState( initialUsers.total );
    const [ nextPageUrl, setNextPageUrl ] = useState( initialUsers.next_page_url );
    const [ loading, setLoading ] = useState( false );
    const [ search, setSearch ] = useState( '' );
    const [ selectedSkill, setSelectedSkill ] = useState<string>( '' );

    const debounceRef = useRef<NodeJS.Timeout | null>(null);

    // Extract and sort unique skills from all users
    const uniqueSkills = Array.from(
        new Set(
            initialUsers.data.flatMap( ( user ) =>
                user.skills?.map( ( skill ) => skill.name ) ?? []
            ).filter( ( name ): name is string => typeof name === 'string' )
        )
    ).sort( ( a, b ) => a.localeCompare( b ) );

    const clearFilters = () => {
        setSearch( '' );
        setSelectedSkill( '' );
    };

    const hasFilters = search !== '' || selectedSkill !== '';

    const fetchFilteredUsers = useCallback( ( query: { search?: string; skill?: string } ) => {
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
                skill: selectedSkill || undefined
            } );
        }, 500 );

        return () => {
            if ( debounceRef.current ) {
                clearTimeout( debounceRef.current );
            }
        };
    }, [ search, selectedSkill, fetchFilteredUsers ] );

    const loadMore = useCallback( () => {
        if ( !nextPageUrl || loading ) return;

        setLoading( true );
        router.get(
            nextPageUrl,
            { search, skill: selectedSkill },
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
    }, [ nextPageUrl, loading, search, selectedSkill ] );

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
                                value={ selectedSkill }
                                onValueChange={ setSelectedSkill }
                                disabled={ loading }
                            >
                                <SelectTrigger className="sm:w-60">
                                    <SelectValue placeholder="Select a skill" />
                                </SelectTrigger>
                                <SelectContent>
                                    { uniqueSkills.map( ( skill ) => (
                                        <SelectItem key={ skill } value={ skill }>
                                            { skill.charAt( 0 ).toUpperCase() + skill.slice( 1 ) }
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
                            { ( search || selectedSkill ) && (
                                <div className="flex items-center gap-2">
                                    { search && (
                                        <span className="text-muted-foreground text-sm">
                                            Search: "{ search }"
                                        </span>
                                    ) }
                                    { selectedSkill && (
                                        <span className="text-muted-foreground text-sm">
                                            Skill: { selectedSkill }
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
                                    selectedSkill={ selectedSkill }
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