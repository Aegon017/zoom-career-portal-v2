import JobseekerCard from "@/components/employer/jobseeker-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import AppLayout from "@/layouts/employer-layout";
import { BreadcrumbItem, Skill, User } from "@/types";
import { Head, router } from "@inertiajs/react";
import { Search } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

const breadcrumbs: BreadcrumbItem[] = [
    { title: "Jobseekers", href: "/employer/jobseekers" },
];

interface Props {
    initialUsers: {
        data: User[];
        total: number;
        next_page_url: string | null;
    };
}

export default function JobseekersListing( { initialUsers }: Props ) {
    const [ users, setUsers ] = useState<User[]>( initialUsers.data );
    const [ total, setTotal ] = useState( initialUsers.total );
    const [ nextPageUrl, setNextPageUrl ] = useState( initialUsers.next_page_url );
    const [ loading, setLoading ] = useState( false );
    const [ search, setSearch ] = useState( "" );
    const [ skill, setSkill ] = useState( "all" );

    const debounceRef = useRef<NodeJS.Timeout | null>( null );

    const fetchFilteredUsers = useCallback(
        ( query: { search?: string; skill?: string } ) => {
            setLoading( true );
            router.get( "/employer/jobseekers", query, {
                preserveState: true,
                replace: true,
                only: [ "initialUsers" ],
                onSuccess: ( page ) => {
                    const data = page.props.initialUsers as {
                        data: User[];
                        total: number;
                        next_page_url: string | null;
                    };
                    setUsers( data.data );
                    setTotal( data.total );
                    setNextPageUrl( data.next_page_url );
                    setLoading( false );
                },
            } );
        },
        []
    );

    useEffect( () => {
        if ( debounceRef.current ) clearTimeout( debounceRef.current );
        debounceRef.current = setTimeout( () => {
            fetchFilteredUsers( { search, skill } );
        }, 500 );
        return () => {
            if ( debounceRef.current ) clearTimeout( debounceRef.current );
        };
    }, [ search, skill, fetchFilteredUsers ] );

    const loadMore = useCallback( () => {
        if ( !nextPageUrl || loading ) return;

        setLoading( true );
        router.get( nextPageUrl, { search, skill }, {
            preserveScroll: true,
            preserveState: true,
            only: [ "initialUsers" ],
            onSuccess: ( page ) => {
                const data = page.props.initialUsers as {
                    data: User[];
                    total: number;
                    next_page_url: string | null;
                };
                setUsers( ( prev ) => [ ...prev, ...data.data ] );
                setNextPageUrl( data.next_page_url );
                setLoading( false );
            },
        } );
    }, [ nextPageUrl, loading, search, skill ] );

    const uniqueSkills = Array.from(
        new Set(
            initialUsers.data
                .flatMap( ( user ) => user.skills?.map( ( skill ) => skill.name ) )
                .filter( ( name ): name is string => typeof name === "string" )
        )
    ).sort();

    return (
        <AppLayout breadcrumbs={ breadcrumbs }>
            <Head title="Jobseekers" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Card className="mb-6 p-0 shadow-none border-0 border-b-2 rounded-none">
                    <CardContent className="p-0 pb-4 space-y-4">
                        <div className="flex flex-col sm:flex-row gap-2">
                            <div className="relative sm:w-80">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                <Input
                                    placeholder="Search candidates..."
                                    className="pl-10"
                                    value={ search }
                                    onChange={ ( e ) => setSearch( e.target.value ) }
                                />
                            </div>
                            <Select
                                value={ skill }
                                onValueChange={ ( val ) => setSkill( val ) }
                            >
                                <SelectTrigger className="sm:w-40">
                                    <SelectValue placeholder="Skill" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All</SelectItem>
                                    { uniqueSkills.map( ( s ) => (
                                        <SelectItem key={ s } value={ s }>
                                            { s.charAt( 0 ).toUpperCase() + s.slice( 1 ) }
                                        </SelectItem>
                                    ) ) }
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex flex-col w-full md:w-2xl mx-auto">
                    { users.length !== 0 && (
                        <span className="mb-4 text-sm text-muted-foreground">
                            { users.length } of { total }
                        </span>
                    ) }
                    { users.length === 0 ? (
                        <div className="text-center text-muted-foreground py-12 text-sm">
                            No jobseekers found.
                        </div>
                    ) : (
                        users.map( ( user ) => (
                            <JobseekerCard key={ user.id } user={ user } />
                        ) )
                    ) }
                </div>

                { nextPageUrl && (
                    <div className="flex justify-center mt-6">
                        <Button variant="outline" onClick={ loadMore } disabled={ loading }>
                            { loading ? "Loading..." : "Load More" }
                        </Button>
                    </div>
                ) }
            </div>
        </AppLayout>
    );
}
