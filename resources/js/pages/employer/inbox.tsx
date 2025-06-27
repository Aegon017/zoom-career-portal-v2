import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import MailIcon from "@/icons/mail-icon";
import AppLayout from "@/layouts/employer-layout";
import { BreadcrumbItem, Chat } from "@/types";
import { Head, router } from "@inertiajs/react";
import { format } from "date-fns";
import {
    ArrowBigLeft,
    ArrowLeft,
    Dot,
    EllipsisVertical,
    Mail,
    SearchIcon,
    Send,
    TriangleAlert,
    User,
} from "lucide-react";
import { useRef, useState } from "react";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "Inbox",
        href: "/inbox",
    },
];

interface Props {
    chats: Chat[];
    currentUserId: number;
}

const Inbox = ( { chats, currentUserId }: Props ) => {
    const [ activeChatId, setActiveChatId ] = useState<string | null>( null );
    const [ isSending, setIsSending ] = useState( false );
    const messageInputRef = useRef<HTMLDivElement>( null );

    const activeChat = chats.find( ( chat ) => String( chat.id ) === activeChatId );

    const getOtherParticipant = ( chat: Chat ) =>
        chat.participants.find( ( p ) => p.user.id !== currentUserId )?.user;

    const getLastMessage = ( chat: Chat ) =>
        chat.messages.length ? chat.messages.at( -1 )!.message : "No messages yet";

    const handleSendMessage = () => {
        if ( !activeChatId || !messageInputRef.current ) return;
        const message = messageInputRef.current.innerText.trim();
        if ( !message ) return;
        setIsSending( true );

        router.post(
            `/inbox/send-message`,
            {
                chat_id: activeChatId,
                message,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    messageInputRef.current!.innerText = "";
                    setIsSending( false );
                },
                onError: () => {
                    setIsSending( false );
                },
            }
        );

        setTimeout( () => {
            messageInputRef.current!.innerText = "";
            setIsSending( false );
        }, 500 );
    };

    const handleKeyPress = ( e: React.KeyboardEvent ) => {
        if ( e.key === "Enter" && !e.shiftKey ) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <AppLayout breadcrumbs={ breadcrumbs }>
            <Head title="Inbox" />
            <div className="min-h-screen bg-gray-50">
                <div className="overflow-hidden flex flex-col md:flex-row h-[600px]">
                    <div
                        className={ `border-r flex flex-col bg-white ${ activeChatId ? "hidden" : "flex"
                            } md:flex md:w-1/3` }
                    >
                        <div className="p-4 border-b">
                            <div className="relative">
                                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                <Input
                                    className="pl-10"
                                    type="search"
                                    placeholder="Search or start new chat"
                                />
                            </div>
                        </div>
                        <ScrollArea className="flex-1">
                            <div className="p-2 space-y-1">
                                { chats.map( ( chat ) => {
                                    const otherUser = getOtherParticipant( chat );
                                    if ( !otherUser ) return null;
                                    const isActive = String( chat.id ) === activeChatId;
                                    const lastMsg = getLastMessage( chat );
                                    const lastDate = chat.messages.length
                                        ? format( new Date( chat.messages.at( -1 )!.created_at ), "MMM dd" )
                                        : "";

                                    return (
                                        <div
                                            key={ chat.id }
                                            className={ `flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors ${ isActive
                                                ? "bg-blue-50 border-l-4 border-blue-500"
                                                : "hover:bg-gray-50"
                                                }` }
                                            onClick={ () => setActiveChatId( String( chat.id ) ) }
                                        >
                                            <Avatar className="h-12 w-12 flex-shrink-0">
                                                <AvatarImage
                                                    src={ otherUser.profile_image || "/placeholder.svg" }
                                                    alt={ `${ otherUser.name }'s avatar` }
                                                />
                                                <AvatarFallback>
                                                    { otherUser.name
                                                        .split( " " )
                                                        .map( ( n ) => n[ 0 ] )
                                                        .join( "" ) }
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between mb-1">
                                                    <h3 className="font-semibold text-sm truncate text-gray-900">
                                                        { otherUser.name }
                                                    </h3>
                                                    <span className="text-xs text-gray-500">{ lastDate }</span>
                                                </div>
                                                <p className="text-sm text-gray-600 truncate">{ lastMsg }</p>
                                            </div>
                                        </div>
                                    );
                                } ) }
                            </div>
                        </ScrollArea>
                    </div>

                    <div
                        className={ `flex-1 flex-col ${ activeChatId ? "flex" : "hidden"
                            } md:flex md:w-2/3` }
                    >
                        { activeChat ? (
                            <>
                                <div className="p-4 border-b bg-white flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="md:hidden"
                                            onClick={ () => setActiveChatId( null ) }
                                        >
                                            <ArrowLeft />
                                        </Button>
                                        { ( () => {
                                            const user = getOtherParticipant( activeChat );
                                            if ( !user ) return null;
                                            return (
                                                <>
                                                    <Avatar className="h-10 w-10">
                                                        <AvatarImage
                                                            src={ user.profile_image || "/placeholder.svg" }
                                                            alt={ `${ user.name }'s avatar` }
                                                        />
                                                        <AvatarFallback>
                                                            { user.name
                                                                .split( " " )
                                                                .map( ( n ) => n[ 0 ] )
                                                                .join( "" ) }
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <h3 className="font-semibold text-gray-900">{ user.name }</h3>
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
                                                <User />
                                                View Profile
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="text-destructive focus:text-destructive">
                                                <TriangleAlert color="red" />
                                                Report
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>

                                <ScrollArea className="flex-1 p-4 bg-gray-100">
                                    { activeChat.messages.length === 0 ? (
                                        <div className="text-center text-gray-500 mt-8">
                                            No messages yet
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            { activeChat.messages.map( ( msg ) => {
                                                const isCurrent = msg.user_id === currentUserId;
                                                return (
                                                    <div
                                                        key={ msg.id }
                                                        className={ `flex ${ isCurrent ? "justify-end" : "justify-start"
                                                            } mb-3` }
                                                    >
                                                        <div className="flex items-end gap-2 max-w-xs lg:max-w-md">
                                                            { isCurrent ? (
                                                                <>
                                                                    <span className="text-xs text-gray-500">
                                                                        { format( new Date( msg.created_at ), "hh:mm a" ) }
                                                                    </span>
                                                                    <div className="px-4 py-2 bg-blue-500 text-white rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl rounded-br-md max-w-xs">
                                                                        <p className="text-sm whitespace-pre-wrap">
                                                                            { msg.message }
                                                                        </p>
                                                                    </div>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <div className="px-4 py-2 bg-white text-gray-900 rounded-tl-2xl rounded-tr-2xl rounded-br-2xl rounded-bl-md max-w-xs">
                                                                        <p className="text-sm whitespace-pre-wrap">
                                                                            { msg.message }
                                                                        </p>
                                                                    </div>
                                                                    <span className="text-xs text-gray-500">
                                                                        { format( new Date( msg.created_at ), "hh:mm a" ) }
                                                                    </span>
                                                                </>
                                                            ) }
                                                        </div>
                                                    </div>
                                                );
                                            } ) }
                                        </div>
                                    ) }
                                </ScrollArea>

                                <div className="p-4 border-t bg-gray-100">
                                    <div className="flex items-end gap-2">
                                        <div className="relative flex-1 rounded-lg flex items-end">
                                            <div
                                                ref={ messageInputRef }
                                                contentEditable
                                                className="rounded-full w-full bg-white p-3 outline-none resize-none overflow-y-auto bg-transparent"
                                                style={ { minHeight: "50px" } }
                                                onKeyDown={ handleKeyPress }
                                                suppressContentEditableWarning
                                            />
                                            { ( !messageInputRef.current ||
                                                messageInputRef.current.innerText.trim() === "" ) && (
                                                    <div className="absolute inset-0 p-3 text-gray-500 pointer-events-none">
                                                        Type a message...
                                                    </div>
                                                ) }
                                            <Button
                                                onClick={ handleSendMessage }
                                                disabled={ isSending }
                                                size="icon"
                                                aria-label="Send message"
                                                className="absolute right-2 bottom-2 rounded-full"
                                            >
                                                <Send />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="hidden md:flex flex-1 items-center justify-center">
                                <div className="text-center">
                                    <MailIcon />
                                    <h2 className="text-xl font-semibold text-gray-900 mt-4">
                                        Message anyone
                                    </h2>
                                    <p className="text-gray-600 mt-2 max-w-md">
                                        Connect with professionals and recruiters to grow your career
                                        through meaningful conversations.
                                    </p>
                                </div>
                            </div>
                        ) }
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default Inbox;
