import { useState, useEffect, useCallback, useMemo } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, PaginationEllipsis } from '@/components/ui/pagination';
import { ChevronDown, ChevronUp, User, MessageSquare, Calendar, Filter, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface User {
    id: number;
    name: string;
    email?: string;
    role?: string;
}

interface Participant {
    id: number;
    user: User;
}

interface Message {
    id: number;
    user: User;
    message: string;
    created_at: string;
}

interface Chat {
    id: number;
    participants: Participant[];
    messages: Message[];
}

interface PageProps {
    chats: {
        data: Chat[];
        current_page: number;
        last_page: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
    filters: { [ key: string ]: string };
    students: Array<{ id: number; name: string }>;
    employers: Array<{ id: number; name: string }>;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Chat logs', href: '' }
];

const ChatLogs = ( { chats, filters: initialFilters, students, employers }: PageProps ) => {
    const [ expandedChats, setExpandedChats ] = useState<Set<number>>( new Set() );
    const [ filters, setFilters ] = useState( initialFilters );
    const [ showFilters, setShowFilters ] = useState( false );

    useEffect( () => setFilters( initialFilters ), [ initialFilters ] );

    const toggleChat = useCallback( ( chatId: number ) => {
        setExpandedChats( prev => {
            const newSet = new Set( prev );
            newSet.has( chatId ) ? newSet.delete( chatId ) : newSet.add( chatId );
            return newSet;
        } );
    }, [] );

    const handleFilterChange = useCallback( ( key: string, value: string ) => {
        const newFilters = { ...filters, [ key ]: value };
        setFilters( newFilters );
        router.get( '/admin/chat-logs', newFilters, { preserveState: true } );
    }, [ filters ] );

    const clearFilter = useCallback( ( key: string ) => {
        const newFilters = { ...filters, [ key ]: '' };
        setFilters( newFilters );
        router.get( '/admin/chat-logs', newFilters, { preserveState: true } );
    }, [ filters ] );

    const clearFilters = useCallback( () => {
        setFilters( {} );
        router.get( '/admin/chat-logs', {}, { preserveState: true } );
    }, [] );

    const hasActiveFilters = useMemo( () =>
        Object.values( filters ).some( value => value && value !== '' ),
        [ filters ]
    );

    const formatDate = useCallback( ( dateString: string ) => {
        const date = new Date( dateString );
        const now = new Date();
        const diffInHours = Math.floor( ( now.getTime() - date.getTime() ) / ( 1000 * 60 * 60 ) );

        return diffInHours < 24
            ? date.toLocaleTimeString( [], { hour: '2-digit', minute: '2-digit' } )
            : date.toLocaleDateString( [], { month: 'short', day: 'numeric', year: 'numeric' } );
    }, [] );

    const renderPaginationItems = useCallback( () => {
        const { current_page, last_page, links } = chats;
        const items = [];

        if ( current_page > 1 ) {
            items.push(
                <PaginationItem key="prev">
                    <PaginationPrevious href={ links[ 0 ].url || '#' } />
                </PaginationItem>
            );
        }

        if ( last_page <= 5 ) {
            for ( let i = 1; i <= last_page; i++ ) {
                const link = links.find( l => l.label === String( i ) ) || links[ i ];
                items.push(
                    <PaginationItem key={ i }>
                        <PaginationLink href={ link?.url || '#' } isActive={ current_page === i }>
                            { i }
                        </PaginationLink>
                    </PaginationItem>
                );
            }
        } else {
            items.push(
                <PaginationItem key={ 1 }>
                    <PaginationLink href={ links.find( l => l.label === '1' )?.url || '#' } isActive={ current_page === 1 }>
                        1
                    </PaginationLink>
                </PaginationItem>
            );

            if ( current_page > 2 ) items.push( <PaginationItem key="ellipsis1"><PaginationEllipsis /></PaginationItem> );
            if ( current_page > 1 ) items.push(
                <PaginationItem key={ current_page - 1 }>
                    <PaginationLink href={ links.find( l => l.label === String( current_page - 1 ) )?.url || '#' }>
                        { current_page - 1 }
                    </PaginationLink>
                </PaginationItem>
            );

            items.push(
                <PaginationItem key={ current_page }>
                    <PaginationLink href={ links.find( l => l.label === String( current_page ) )?.url || '#' } isActive>
                        { current_page }
                    </PaginationLink>
                </PaginationItem>
            );

            if ( current_page < last_page ) items.push(
                <PaginationItem key={ current_page + 1 }>
                    <PaginationLink href={ links.find( l => l.label === String( current_page + 1 ) )?.url || '#' }>
                        { current_page + 1 }
                    </PaginationLink>
                </PaginationItem>
            );

            if ( current_page < last_page - 1 ) items.push( <PaginationItem key="ellipsis2"><PaginationEllipsis /></PaginationItem> );

            items.push(
                <PaginationItem key={ last_page }>
                    <PaginationLink href={ links.find( l => l.label === String( last_page ) )?.url || '#' } isActive={ current_page === last_page }>
                        { last_page }
                    </PaginationLink>
                </PaginationItem>
            );
        }

        if ( current_page < last_page ) {
            items.push(
                <PaginationItem key="next">
                    <PaginationNext href={ links[ links.length - 1 ].url || '#' } />
                </PaginationItem>
            );
        }

        return items;
    }, [ chats ] );

    return (
        <AppLayout breadcrumbs={ breadcrumbs }>
            <Head title="Chat Logs" />
            <div className="p-4 md:p-6 space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Chat Logs</h1>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" onClick={ () => setShowFilters( !showFilters ) } className="flex items-center gap-2">
                            <Filter className="h-4 w-4" />
                            Filters
                            { hasActiveFilters && (
                                <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 flex items-center justify-center">
                                    { Object.values( filters ).filter( v => v ).length }
                                </Badge>
                            ) }
                        </Button>
                        <div className="flex items-center text-sm text-muted-foreground">
                            <MessageSquare className="mr-1 h-4 w-4" />
                            <span>{ chats.data.length } chats on this page</span>
                        </div>
                    </div>
                </div>

                { showFilters && (
                    <Card>
                        <CardHeader className="pb-3">
                            <div className="flex justify-between items-center">
                                <CardTitle className="text-lg">Filters</CardTitle>
                                <div className="flex items-center gap-2">
                                    { hasActiveFilters && (
                                        <Button variant="ghost" onClick={ clearFilters } className="h-8 px-2">
                                            Clear filters
                                            <X className="ml-1 h-3 w-3" />
                                        </Button>
                                    ) }
                                    <Button variant="ghost" size="icon" onClick={ () => setShowFilters( false ) } className="h-8 w-8">
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="student">Student</Label>
                                <Select value={ filters.student || '' } onValueChange={ value => handleFilterChange( 'student', value ) }>
                                    <SelectTrigger id="student"><SelectValue placeholder="Select student" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Students</SelectItem>
                                        { students.map( student => (
                                            <SelectItem key={ student.id } value={ student.id.toString() }>{ student.name }</SelectItem>
                                        ) ) }
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="employer">Employer</Label>
                                <Select value={ filters.employer || '' } onValueChange={ value => handleFilterChange( 'employer', value ) }>
                                    <SelectTrigger id="employer"><SelectValue placeholder="Select employer" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Employers</SelectItem>
                                        { employers.map( employer => (
                                            <SelectItem key={ employer.id } value={ employer.id.toString() }>{ employer.name }</SelectItem>
                                        ) ) }
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="start_date">Start Date</Label>
                                <Input id="start_date" type="date" value={ filters.start_date || '' }
                                    onChange={ e => handleFilterChange( 'start_date', e.target.value ) } />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="end_date">End Date</Label>
                                <Input id="end_date" type="date" value={ filters.end_date || '' }
                                    onChange={ e => handleFilterChange( 'end_date', e.target.value ) } />
                            </div>
                        </CardContent>
                    </Card>
                ) }

                { hasActiveFilters && (
                    <div className="flex flex-wrap gap-2">
                        { Object.entries( filters ).map( ( [ key, value ] ) =>
                            value && (
                                <Badge key={ key } variant="secondary" className="gap-1 py-1">
                                    { key === 'student' && `Student: ${ students.find( s => s.id.toString() === value )?.name || value }` }
                                    { key === 'employer' && `Employer: ${ employers.find( e => e.id.toString() === value )?.name || value }` }
                                    { key === 'start_date' && `From: ${ value }` }
                                    { key === 'end_date' && `To: ${ value }` }
                                    <X className="h-3 w-3 cursor-pointer" onClick={ () => clearFilter( key ) } />
                                </Badge>
                            )
                        ) }
                    </div>
                ) }

                { chats.data.length === 0 ? (
                    <Card className="text-center py-12">
                        <CardContent>
                            <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground/50" />
                            <h3 className="mt-4 text-lg font-medium">No chats found</h3>
                            <p className="text-muted-foreground mt-2">
                                { hasActiveFilters ? 'Try adjusting your filters to see more results.' : 'There are no chat logs to display at this time.' }
                            </p>
                            { hasActiveFilters && <Button variant="outline" className="mt-4" onClick={ clearFilters }>Clear Filters</Button> }
                        </CardContent>
                    </Card>
                ) : (
                    <>
                        { chats.data.map( chat => {
                            const isExpanded = expandedChats.has( chat.id );
                            const messageCount = chat.messages.length;
                            const lastMessage = messageCount > 0 ? chat.messages[ messageCount - 1 ] : null;

                            return (
                                <Card key={ chat.id } className="overflow-hidden transition-all">
                                    <CardHeader className="cursor-pointer pb-3 hover:bg-muted/30 transition-colors" onClick={ () => toggleChat( chat.id ) }>
                                        <div className="flex justify-between items-start">
                                            <CardTitle className="text-lg flex items-center gap-2">
                                                <span>Chat #{ chat.id }</span>
                                                <Badge variant="outline" className="ml-2">{ messageCount } message{ messageCount !== 1 ? 's' : '' }</Badge>
                                            </CardTitle>
                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                { isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" /> }
                                            </Button>
                                        </div>

                                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2 text-sm text-muted-foreground">
                                            <div className="flex items-center">
                                                <User className="mr-1 h-3 w-3" />
                                                <span className="font-medium mr-1">Participants:</span>
                                                <div className="flex flex-wrap gap-1">
                                                    { chat.participants.map( p => (
                                                        <Badge key={ p.id } variant="secondary" className="text-xs">
                                                            { p.user.name }{ p.user.role && ` (${ p.user.role })` }
                                                        </Badge>
                                                    ) ) }
                                                </div>
                                            </div>

                                            { lastMessage && (
                                                <div className="flex items-center">
                                                    <Calendar className="mr-1 h-3 w-3" />
                                                    <span>Last activity: { formatDate( lastMessage.created_at ) }</span>
                                                </div>
                                            ) }
                                        </div>
                                    </CardHeader>

                                    { isExpanded && (
                                        <CardContent className="pt-3 border-t">
                                            <div className="space-y-4">
                                                { messageCount > 0 ? chat.messages.map( msg => (
                                                    <div key={ msg.id } className="text-sm p-3 rounded-lg bg-muted/30">
                                                        <div className="flex justify-between items-start">
                                                            <strong className="flex items-center">
                                                                <User className="mr-1 h-3 w-3" />
                                                                { msg.user.name }{ msg.user.role && ` (${ msg.user.role })` }
                                                            </strong>
                                                            <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                                                                { new Date( msg.created_at ).toLocaleString() }
                                                            </span>
                                                        </div>
                                                        <p className="mt-1.5 whitespace-pre-wrap break-words" dangerouslySetInnerHTML={ { __html: msg.message } } />
                                                    </div>
                                                ) ) : (
                                                    <div className="text-center py-4 text-muted-foreground">No messages in this chat</div>
                                                ) }
                                            </div>
                                        </CardContent>
                                    ) }
                                </Card>
                            );
                        } ) }

                        { chats.last_page > 1 && (
                            <Pagination className="mt-6">
                                <PaginationContent>{ renderPaginationItems() }</PaginationContent>
                            </Pagination>
                        ) }
                    </>
                ) }
            </div>
        </AppLayout>
    );
};

export default ChatLogs;