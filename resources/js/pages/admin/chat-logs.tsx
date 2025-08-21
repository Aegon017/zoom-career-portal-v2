import React, { useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
    PaginationEllipsis
} from '@/components/ui/pagination';
import {
    ChevronDown,
    ChevronUp,
    User,
    MessageSquare,
    Calendar
} from 'lucide-react';

type User = {
    id: number;
    name: string;
    email?: string;
};

type Participant = {
    id: number;
    user: User;
};

type Message = {
    id: number;
    user: User;
    message: string;
    created_at: string;
};

type Chat = {
    id: number;
    participants: Participant[];
    messages: Message[];
};

type PageProps = {
    chats: {
        data: Chat[];
        current_page: number;
        last_page: number;
        links: {
            url: string | null;
            label: string;
            active: boolean;
        }[];
    };
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Chat logs',
        href: '',
    },
];

const ChatLogs: React.FC = () => {
    const { chats } = usePage<PageProps>().props;
    const [ expandedChats, setExpandedChats ] = useState<Set<number>>( new Set() );

    const toggleChat = ( chatId: number ) => {
        const newExpanded = new Set( expandedChats );
        if ( newExpanded.has( chatId ) ) {
            newExpanded.delete( chatId );
        } else {
            newExpanded.add( chatId );
        }
        setExpandedChats( newExpanded );
    };

    // Function to format date relative to now or as full date if older
    const formatDate = ( dateString: string ) => {
        const date = new Date( dateString );
        const now = new Date();
        const diffInHours = Math.floor( ( now.getTime() - date.getTime() ) / ( 1000 * 60 * 60 ) );

        if ( diffInHours < 24 ) {
            return date.toLocaleTimeString( [], { hour: '2-digit', minute: '2-digit' } );
        } else {
            return date.toLocaleDateString( [], { month: 'short', day: 'numeric', year: 'numeric' } );
        }
    };

    // Simplified pagination links for better mobile experience
    const renderPaginationItems = () => {
        const { current_page, last_page, links } = chats;
        const items = [];

        // Previous button
        if ( current_page > 1 ) {
            items.push(
                <PaginationItem key="prev">
                    <PaginationPrevious href={ links[ 0 ].url || '#' } />
                </PaginationItem>
            );
        }

        // Page numbers - show limited items on mobile
        if ( last_page <= 5 ) {
            // Show all pages if there are 5 or fewer
            for ( let i = 1; i <= last_page; i++ ) {
                const link = links.find( l => l.label === String( i ) ) || links[ i ];
                items.push(
                    <PaginationItem key={ i }>
                        <PaginationLink
                            href={ link?.url || '#' }
                            isActive={ current_page === i }
                        >
                            { i }
                        </PaginationLink>
                    </PaginationItem>
                );
            }
        } else {
            // Show first, current-1, current, current+1, last pages with ellipsis
            items.push(
                <PaginationItem key={ 1 }>
                    <PaginationLink
                        href={ links.find( l => l.label === '1' )?.url || '#' }
                        isActive={ current_page === 1 }
                    >
                        1
                    </PaginationLink>
                </PaginationItem>
            );

            if ( current_page > 2 ) {
                items.push(
                    <PaginationItem key="ellipsis1">
                        <PaginationEllipsis />
                    </PaginationItem>
                );
            }

            if ( current_page > 1 ) {
                items.push(
                    <PaginationItem key={ current_page - 1 }>
                        <PaginationLink
                            href={ links.find( l => l.label === String( current_page - 1 ) )?.url || '#' }
                        >
                            { current_page - 1 }
                        </PaginationLink>
                    </PaginationItem>
                );
            }

            items.push(
                <PaginationItem key={ current_page }>
                    <PaginationLink
                        href={ links.find( l => l.label === String( current_page ) )?.url || '#' }
                        isActive
                    >
                        { current_page }
                    </PaginationLink>
                </PaginationItem>
            );

            if ( current_page < last_page ) {
                items.push(
                    <PaginationItem key={ current_page + 1 }>
                        <PaginationLink
                            href={ links.find( l => l.label === String( current_page + 1 ) )?.url || '#' }
                        >
                            { current_page + 1 }
                        </PaginationLink>
                    </PaginationItem>
                );
            }

            if ( current_page < last_page - 1 ) {
                items.push(
                    <PaginationItem key="ellipsis2">
                        <PaginationEllipsis />
                    </PaginationItem>
                );
            }

            items.push(
                <PaginationItem key={ last_page }>
                    <PaginationLink
                        href={ links.find( l => l.label === String( last_page ) )?.url || '#' }
                        isActive={ current_page === last_page }
                    >
                        { last_page }
                    </PaginationLink>
                </PaginationItem>
            );
        }

        // Next button
        if ( current_page < last_page ) {
            items.push(
                <PaginationItem key="next">
                    <PaginationNext href={ links[ links.length - 1 ].url || '#' } />
                </PaginationItem>
            );
        }

        return items;
    };

    return (
        <AppLayout breadcrumbs={ breadcrumbs }>
            <Head title="Chat Logs" />
            <div className="p-4 md:p-6 space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Chat Logs</h1>
                    <div className="flex items-center text-sm text-muted-foreground">
                        <MessageSquare className="mr-1 h-4 w-4" />
                        <span>{ chats.data.length } chats on this page</span>
                    </div>
                </div>

                { chats.data.length === 0 ? (
                    <Card className="text-center py-12">
                        <CardContent>
                            <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground/50" />
                            <h3 className="mt-4 text-lg font-medium">No chats found</h3>
                            <p className="text-muted-foreground mt-2">
                                There are no chat logs to display at this time.
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <>
                        { chats.data.map( ( chat ) => {
                            const isExpanded = expandedChats.has( chat.id );
                            const messageCount = chat.messages.length;
                            const lastMessage = messageCount > 0
                                ? chat.messages[ messageCount - 1 ]
                                : null;

                            return (
                                <Card key={ chat.id } className="overflow-hidden transition-all">
                                    <CardHeader
                                        className="cursor-pointer pb-3 hover:bg-muted/30 transition-colors"
                                        onClick={ () => toggleChat( chat.id ) }
                                    >
                                        <div className="flex justify-between items-start">
                                            <CardTitle className="text-lg flex items-center gap-2">
                                                <span>Chat #{ chat.id }</span>
                                                <Badge variant="outline" className="ml-2">
                                                    { messageCount } message{ messageCount !== 1 ? 's' : '' }
                                                </Badge>
                                            </CardTitle>
                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                { isExpanded ? (
                                                    <ChevronUp className="h-4 w-4" />
                                                ) : (
                                                    <ChevronDown className="h-4 w-4" />
                                                ) }
                                            </Button>
                                        </div>

                                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2 text-sm text-muted-foreground">
                                            <div className="flex items-center">
                                                <User className="mr-1 h-3 w-3" />
                                                <span className="font-medium mr-1">Participants:</span>
                                                <div className="flex flex-wrap gap-1">
                                                    { chat.participants.map( ( p ) => (
                                                        <Badge
                                                            key={ p.id }
                                                            variant="secondary"
                                                            className="text-xs"
                                                        >
                                                            { p.user.name }
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
                                                { messageCount > 0 ? (
                                                    chat.messages.map( ( msg ) => (
                                                        <div
                                                            key={ msg.id }
                                                            className="text-sm p-3 rounded-lg bg-muted/30"
                                                        >
                                                            <div className="flex justify-between items-start">
                                                                <strong className="flex items-center">
                                                                    <User className="mr-1 h-3 w-3" />
                                                                    { msg.user.name }
                                                                </strong>
                                                                <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                                                                    { new Date( msg.created_at ).toLocaleString() }
                                                                </span>
                                                            </div>
                                                            <p
                                                                className="mt-1.5 whitespace-pre-wrap break-words"
                                                                dangerouslySetInnerHTML={ { __html: msg.message } }
                                                            />
                                                        </div>
                                                    ) )
                                                ) : (
                                                    <div className="text-center py-4 text-muted-foreground">
                                                        No messages in this chat
                                                    </div>
                                                ) }
                                            </div>
                                        </CardContent>
                                    ) }
                                </Card>
                            );
                        } ) }

                        {/* Pagination */ }
                        { chats.last_page > 1 && (
                            <Pagination className="mt-6">
                                <PaginationContent>
                                    { renderPaginationItems() }
                                </PaginationContent>
                            </Pagination>
                        ) }
                    </>
                ) }
            </div>
        </AppLayout>
    );
};

export default ChatLogs;