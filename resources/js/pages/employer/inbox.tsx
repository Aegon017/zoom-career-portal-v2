import { useEffect, useRef, useState } from "react";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import AppLayout from "@/layouts/employer-layout";
import MailIcon from "@/icons/mail-icon";
import { BreadcrumbItem, Chat } from "@/types";
import { Head, router } from "@inertiajs/react";
import { useEchoPublic } from "@laravel/echo-react";
import { format } from "date-fns";
import {
    ArrowLeft,
    EllipsisVertical,
    Send,
    TriangleAlert,
    User,
    SearchIcon,
} from "lucide-react";

const breadcrumbs: BreadcrumbItem[] = [ { title: "Inbox", href: "/inbox" } ];

interface Props {
    chats: Chat[];
    currentUserId: number;
}

export default function Inbox( { chats, currentUserId }: Props ) {
    const [ activeChatId, setActiveChatId ] = useState<string | null>( null );
    const [ isSending, setIsSending ] = useState( false );
    const [ chatsState, setChats ] = useState<Chat[]>( chats );
    const [ message, setMessage ] = useState( "" );

    const messageInputRef = useRef<HTMLDivElement>( null );
    const messagesEndRef = useRef<HTMLDivElement>( null );

    const activeChat = chatsState.find( ( c ) => String( c.id ) === activeChatId );

    const scrollToBottom = () =>
        messagesEndRef.current?.scrollIntoView( { behavior: "smooth" } );

    useEffect( () => {
        if ( activeChatId ) {
            scrollToBottom();
        }
    }, [ activeChatId, chatsState ] );

    const getOtherParticipant = ( chat: Chat ) =>
        chat.participants.find( ( p ) => p.user.id !== currentUserId )?.user;

    const getLastMessage = ( chat: Chat ) =>
        chat.messages.length
            ? chat.messages[ chat.messages.length - 1 ]!.message
            : "No messages yet";

    const handleSendMessage = () => {
        if ( !activeChatId || !message.trim() ) return;

        setIsSending( true );
        router.post(
            "/inbox/send-message",
            { chat_id: activeChatId, message: message.trim() },
            {
                preserveScroll: true,
                onSuccess: () => {
                    if ( messageInputRef.current ) {
                        messageInputRef.current.innerText = "";
                    }
                    setMessage( "" );
                    setIsSending( false );
                },
                onError: () => setIsSending( false ),
            }
        );
    };

    const handleKeyPress = ( e: React.KeyboardEvent ) => {
        if ( e.key === "Enter" && !e.shiftKey ) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    useEchoPublic( "chats", "MessageSent", ( e: any ) => {
        setChats( ( prev ) =>
            prev.map( ( c ) =>
                c.id === e.message.chat_id
                    ? { ...c, messages: [ ...c.messages, e.message ] }
                    : c
            )
        );
    } );

    return (
        <AppLayout breadcrumbs={ breadcrumbs }>
            <Head title="Inbox" />
            <div className="flex h-[calc(100vh-80px)] overflow-hidden bg-gray-50">
                <div
                    className={ `flex flex-col border-r w-full bg-white ${ activeChatId ? "hidden" : "flex"
                        } lg:flex lg:w-1/3` }
                >
                    <div className="p-4 border-b">
                        <div className="relative">
                            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                            <Input
                                className="pl-10"
                                type="search"
                                placeholder="Search or start new chat"
                            />
                        </div>
                    </div>
                    <ScrollArea className="flex-1">
                        <div className="p-2 space-y-1">
                            { chatsState.map( ( chat ) => {
                                const other = getOtherParticipant( chat );
                                if ( !other ) return null;
                                const active = String( chat.id ) === activeChatId;
                                const last = getLastMessage( chat );
                                const dateStr = chat.messages.length
                                    ? format(
                                        new Date(
                                            chat.messages[ chat.messages.length - 1 ]!.created_at
                                        ),
                                        "MMM dd"
                                    )
                                    : "";

                                return (
                                    <div
                                        key={ chat.id }
                                        className={ `flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors ${ active
                                            ? "bg-blue-50 border-l-4 border-blue-500"
                                            : "hover:bg-gray-50"
                                            }` }
                                        onClick={ () => setActiveChatId( String( chat.id ) ) }
                                    >
                                        <Avatar className="h-12 w-12">
                                            <AvatarImage
                                                src={ other.profile_image || "/placeholder.svg" }
                                                alt={ `${ other.name }'s avatar` }
                                            />
                                            <AvatarFallback>
                                                { other.name
                                                    .split( " " )
                                                    .map( ( n ) => n[ 0 ] )
                                                    .join( "" ) }
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between mb-1">
                                                <h3 className="font-semibold text-sm truncate text-gray-900">
                                                    { other.name }
                                                </h3>
                                                <span className="text-xs text-gray-500">{ dateStr }</span>
                                            </div>
                                            <p className="text-sm text-gray-600 truncate">{ last }</p>
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
                                        onClick={ () => setActiveChatId( null ) }
                                    >
                                        <ArrowLeft />
                                    </Button>
                                    { ( () => {
                                        const usr = getOtherParticipant( activeChat );
                                        if ( !usr ) return null;
                                        return (
                                            <>
                                                <Avatar className="h-10 w-10">
                                                    <AvatarImage
                                                        src={ usr.profile_image || "/placeholder.svg" }
                                                        alt={ `${ usr.name }'s avatar` }
                                                    />
                                                    <AvatarFallback>
                                                        { usr.name
                                                            .split( " " )
                                                            .map( ( n ) => n[ 0 ] )
                                                            .join( "" ) }
                                                    </AvatarFallback>
                                                </Avatar>
                                                <h3 className="font-semibold text-gray-900">{ usr.name }</h3>
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
                                            <User className="mr-2 w-4 h-4" />
                                            View Profile
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="text-destructive focus:text-destructive">
                                            <TriangleAlert className="mr-2 w-4 h-4 text-red-500" />
                                            Report
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            <ScrollArea className="flex-1 overflow-y-auto bg-gray-100 p-4">
                                { activeChat.messages.length === 0 ? (
                                    <div className="text-center text-gray-500 mt-8">
                                        No messages yet
                                    </div>
                                ) : (
                                    <div className="space-y-4 pb-24">
                                        { activeChat.messages.map( ( msg ) => {
                                            const isMe = msg.user_id === currentUserId;
                                            return (
                                                <div
                                                    key={ msg.id }
                                                    className={ `flex ${ isMe ? "justify-end" : "justify-start"
                                                        } mb-3` }
                                                >
                                                    <div className="flex items-end gap-2 max-w-xs lg:max-w-lg">
                                                        { isMe ? (
                                                            <>
                                                                <span className="text-xs text-gray-500">
                                                                    { format(
                                                                        new Date( msg.created_at ),
                                                                        "hh:mm a"
                                                                    ) }
                                                                </span>
                                                                <div className="px-4 py-2 bg-blue-500 text-white rounded-tl-2xl rounded-bl-2xl rounded-tr-2xl">
                                                                    <p className="text-sm whitespace-pre-wrap">
                                                                        { msg.message }
                                                                    </p>
                                                                </div>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <div className="px-4 py-2 bg-white text-gray-900 rounded-tl-2xl rounded-br-2xl rounded-tr-2xl">
                                                                    <p className="text-sm whitespace-pre-wrap">
                                                                        { msg.message }
                                                                    </p>
                                                                </div>
                                                                <span className="text-xs text-gray-500">
                                                                    { format(
                                                                        new Date( msg.created_at ),
                                                                        "hh:mm a"
                                                                    ) }
                                                                </span>
                                                            </>
                                                        ) }
                                                    </div>
                                                </div>
                                            );
                                        } ) }
                                        <div ref={ messagesEndRef } />
                                    </div>
                                ) }
                            </ScrollArea>

                            <div className="p-4 border-t bg-white">
                                <div className="relative flex items-end gap-2">
                                    <div className="flex-1 relative">
                                        <div className="relative">
                                            <div
                                                ref={ messageInputRef }
                                                contentEditable
                                                suppressContentEditableWarning
                                                onInput={ ( e ) =>
                                                    setMessage( ( e.target as HTMLElement ).innerText )
                                                }
                                                onKeyDown={ handleKeyPress }
                                                className="w-full p-3 bg-white rounded-full outline-none resize-none overflow-y-auto"
                                                style={ { minHeight: "50px" } }
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
                                <h2 className="mt-4 text-xl font-semibold text-gray-900">
                                    Message anyone
                                </h2>
                                <p className="mt-2 max-w-lg text-gray-600">
                                    Connect with professionals and recruiters through meaningful
                                    conversations.
                                </p>
                            </div>
                        </div>
                    ) }
                </div>
            </div>
        </AppLayout>
    );
}
