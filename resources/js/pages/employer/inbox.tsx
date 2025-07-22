import { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import AppLayout from "@/layouts/employer-layout";
import MailIcon from "@/icons/mail-icon";
import { BreadcrumbItem, Chat, User } from "@/types";
import { Head, router } from "@inertiajs/react";
import { useEcho } from "@laravel/echo-react";
import { format, isToday, isYesterday, differenceInCalendarDays } from "date-fns";
import { ArrowLeft, EllipsisVertical, Send, TriangleAlert, User as UserIcon, SearchIcon } from "lucide-react";

const breadcrumbs: BreadcrumbItem[] = [ { title: "Inbox", href: "/inbox" } ];

interface Props {
    chats: Chat[];
    currentUserId: number;
    activeChat?: Chat;
    targetUser?: User;
}

export default function Inbox( { chats, currentUserId, activeChat: initialChat, targetUser }: Props ) {
    const [ activeChat, setActiveChat ] = useState<Chat | null>( initialChat || null );
    const [ message, setMessage ] = useState( "" );
    const [ isSending, setIsSending ] = useState( false );
    const [ chatsState, setChats ] = useState<Chat[]>( chats );

    const messageInputRef = useRef<HTMLDivElement>( null );
    const messagesEndRef = useRef<HTMLDivElement>( null );
    const scrollAreaRef = useRef<HTMLDivElement>( null );

    useEffect( () => {
        if ( !activeChat && targetUser ) {
            messageInputRef.current?.focus();
        }
    }, [ activeChat, targetUser ] );

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView( { behavior: "smooth" } );
    };

    const getOtherParticipant = ( chat: Chat ) =>
        chat.participants.find( ( p ) => p.user.id !== currentUserId )?.user;

    const handleSendMessage = () => {
        if ( !message.trim() ) return;

        setIsSending( true );

        router.post(
            "/inbox/send-message",
            {
                chat_id: activeChat?.id,
                user_id: targetUser?.id,
                message,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setMessage( "" );
                    if ( messageInputRef.current ) messageInputRef.current.innerText = "";
                    setIsSending( false );
                },
                onError: () => setIsSending( false ),
            }
        );
    };

    useEcho( `chat.${ activeChat?.id }`, "MessageSent", ( e: any ) => {
        setChats( ( prev ) => {
            const idx = prev.findIndex( ( c ) => c.id === e.message.chat_id );
            let updatedChats;

            if ( idx === -1 ) {
                const newChat = {
                    id: e.message.chat_id,
                    participants: [
                        { user: { id: currentUserId } },
                        { user: e.user },
                    ],
                    messages: [ e.message ],
                    created_at: e.message.created_at || new Date().toISOString(),
                    updated_at: e.message.created_at || new Date().toISOString(),
                } as Chat;

                updatedChats = [ ...prev, newChat ];

                if (
                    ( !activeChat && targetUser && targetUser.id === e.user.id ) ||
                    ( activeChat && activeChat.id === e.message.chat_id )
                ) {
                    setActiveChat( newChat );
                }

                return updatedChats;
            }

            updatedChats = [ ...prev ];
            const chat = updatedChats[ idx ];

            const existingMsg = ( chat.messages || [] ).find( ( m ) => m.id === e.message.id );
            if ( !existingMsg ) {
                updatedChats[ idx ] = {
                    ...chat,
                    messages: [ ...( chat.messages || [] ), e.message ],
                };
            }

            if ( activeChat && activeChat.id === e.message.chat_id ) {
                setActiveChat( ( prevActive ) =>
                    prevActive
                        ? {
                            ...prevActive,
                            messages: [
                                ...( prevActive.messages || [] ),
                                ...( existingMsg ? [] : [ e.message ] ),
                            ],
                        }
                        : prevActive
                );
            }

            return updatedChats;
        } );
    } );

    const openChat = ( chatId: number ) => {
        router.get( `/inbox?chat=${ chatId }`, {} );
    };

    useEffect( () => {
        if ( activeChat?.messages?.length ) {
            requestAnimationFrame( () => {
                scrollToBottom();
            } );
        }
    }, [ activeChat?.messages?.length ] );

    // Group messages by date
    const groupMessagesByDate = () => {
        if ( !activeChat?.messages?.length ) return [];

        const grouped: { date: string; messages: any[] }[] = [];
        let currentGroup: any[] = [];
        let currentDate: string | null = null;

        activeChat.messages.forEach( ( msg, index ) => {
            const msgDate = format( new Date( msg.created_at ), "yyyy-MM-dd" );

            if ( msgDate !== currentDate ) {
                if ( currentGroup.length > 0 ) {
                    grouped.push( { date: currentDate!, messages: [ ...currentGroup ] } );
                    currentGroup = [];
                }
                currentDate = msgDate;
            }

            currentGroup.push( msg );

            if ( index === activeChat.messages.length - 1 ) {
                grouped.push( { date: currentDate!, messages: [ ...currentGroup ] } );
            }
        } );

        return grouped;
    };

    const getDateLabel = ( dateString: string ) => {
        const date = new Date( dateString );
        if ( isToday( date ) ) return "Today";
        if ( isYesterday( date ) ) return "Yesterday";
        return format( date, "MMMM d, yyyy" );
    };

    return (
        <AppLayout breadcrumbs={ breadcrumbs }>
            <Head title="Inbox" />
            <div className="flex h-[calc(100vh-80px)] overflow-hidden bg-background">
                <div className={ `flex flex-col border-r bg-white ${ activeChat ? "hidden" : "flex" } w-full lg:flex lg:w-1/3` }>
                    <div className="p-4 border-b">
                        <div className="relative">
                            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                            <Input className="pl-10" type="search" placeholder="Search or start new chat" />
                        </div>
                    </div>
                    <ScrollArea>
                        <div className="p-2 space-y-1">
                            { chatsState.map( ( chat ) => {
                                const other = getOtherParticipant( chat );
                                if ( !other ) return null;
                                const last = chat.messages?.at( -1 )?.message || "No messages yet";
                                const dateStr = chat.messages?.length
                                    ? format( new Date( chat.messages.at( -1 )!.created_at ), "MMM dd" )
                                    : "";

                                return (
                                    <div
                                        key={ chat.id }
                                        onClick={ () => openChat( chat.id ) }
                                        className="flex items-start gap-3 p-3 rounded-lg cursor-pointer hover:bg-muted"
                                    >
                                        <Avatar className="h-12 w-12">
                                            <AvatarImage src={ other.avatar_url } />
                                            <AvatarFallback>
                                                { other.name.split( " " ).map( ( n ) => n[ 0 ] ).join( "" ) }
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between mb-1">
                                                <h3 className="font-semibold text-sm truncate text-foreground">{ other.name }</h3>
                                                <span className="text-xs text-muted-foreground">{ dateStr }</span>
                                            </div>
                                            <p className="text-sm text-muted-foreground truncate line-clamp-1 text-wrap">{ last }</p>
                                        </div>
                                    </div>
                                );
                            } ) }
                        </div>
                    </ScrollArea>
                </div>

                <div className="flex flex-col flex-1 lg:w-2/3">
                    { activeChat ? (
                        <>
                            <div className="flex items-center justify-between p-4 border-b bg-white">
                                <div className="flex items-center gap-3">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="lg:hidden"
                                        onClick={ () => router.get( "/inbox" ) }
                                    >
                                        <ArrowLeft />
                                    </Button>
                                    { ( () => {
                                        const usr = getOtherParticipant( activeChat );
                                        if ( !usr ) return null;
                                        return (
                                            <>
                                                <Avatar className="h-10 w-10">
                                                    <AvatarImage src={ usr.avatar_url } />
                                                    <AvatarFallback>
                                                        { usr.name.split( " " ).map( ( n ) => n[ 0 ] ).join( "" ) }
                                                    </AvatarFallback>
                                                </Avatar>
                                                <h3 className="font-semibold text-foreground">{ usr.name }</h3>
                                            </>
                                        );
                                    } )() }
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon">
                                            <EllipsisVertical />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem>
                                            <UserIcon className="mr-2 w-4 h-4" /> View Profile
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="text-destructive focus:text-destructive">
                                            <TriangleAlert className="mr-2 w-4 h-4 text-red-500" /> Report
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            <ScrollArea ref={ scrollAreaRef } className="flex-1 overflow-y-auto bg-gray-100 p-4">
                                <div className="space-y-4 pb-24">
                                    { groupMessagesByDate().map( ( group ) => (
                                        <div key={ group.date }>
                                            <div className="sticky top-0 z-10 flex justify-center my-4">
                                                <span className="px-3 py-1 text-xs bg-gray-200 rounded-full text-muted-foreground">
                                                    { getDateLabel( group.date ) }
                                                </span>
                                            </div>
                                            { group.messages.map( ( msg ) => {
                                                const isMe = msg.user_id === currentUserId;
                                                return (
                                                    <div key={ msg.id } className={ `flex ${ isMe ? "justify-end" : "justify-start" }` }>
                                                        <div className="flex items-end gap-2 max-w-xs lg:max-w-lg">
                                                            { isMe && (
                                                                <span className="text-xs text-gray-500 text-nowrap">
                                                                    { format( new Date( msg.created_at ), "hh:mm a" ) }
                                                                </span>
                                                            ) }
                                                            <div
                                                                className={ `px-4 py-2 rounded-tr-2xl rounded-tl-2xl ${ isMe
                                                                        ? "bg-primary text-white rounded-bl-2xl"
                                                                        : "bg-white text-foreground rounded-br-2xl"
                                                                    }` }
                                                            >
                                                                <p className="text-sm whitespace-pre-wrap">{ msg.message }</p>
                                                            </div>
                                                            { !isMe && (
                                                                <span className="text-xs text-gray-500 text-nowrap">
                                                                    { format( new Date( msg.created_at ), "hh:mm a" ) }
                                                                </span>
                                                            ) }
                                                        </div>
                                                    </div>
                                                );
                                            } ) }
                                        </div>
                                    ) ) }
                                    <div ref={ messagesEndRef } />
                                </div>
                            </ScrollArea>

                            <div className="p-4 border-t bg-white">
                                <div className="relative flex items-end gap-2">
                                    <div className="flex-1 relative">
                                        <div className="relative">
                                            <div
                                                ref={ messageInputRef }
                                                contentEditable
                                                suppressContentEditableWarning
                                                onInput={ ( e ) => setMessage( ( e.target as HTMLElement ).innerText ) }
                                                onKeyDown={ ( e ) => {
                                                    if ( e.key === "Enter" && !e.shiftKey ) {
                                                        e.preventDefault();
                                                        handleSendMessage();
                                                    }
                                                } }
                                                className="w-full p-3 bg-white rounded-full outline-none resize-none overflow-y-auto min-h-[50px]"
                                            />
                                            { message.trim() === "" && (
                                                <div className="absolute inset-0 p-3 text-gray-500 pointer-events-none">
                                                    Type a message...
                                                </div>
                                            ) }
                                        </div>
                                        <Button
                                            onClick={ handleSendMessage }
                                            disabled={ isSending }
                                            size="icon"
                                            aria-label="Send message"
                                            className="absolute bottom-2 right-2"
                                        >
                                            <Send />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 items-center justify-center hidden lg:flex">
                            <div className="text-center">
                                <MailIcon />
                                <h2 className="mt-4 text-xl font-semibold text-foreground">Message anyone</h2>
                                <p className="mt-2 max-w-lg text-muted-foreground">
                                    Connect with professionals and recruiters through meaningful conversations.
                                </p>
                            </div>
                        </div>
                    ) }
                </div>
            </div>
        </AppLayout>
    );
}