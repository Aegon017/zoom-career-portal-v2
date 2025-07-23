import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import MailIcon from '@/icons/mail-icon';
import AppLayout from '@/layouts/employer-layout';
import { BreadcrumbItem, Chat, User } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useEcho } from '@laravel/echo-react';
import { format, isToday, isYesterday } from 'date-fns';
import { ArrowLeft, EllipsisVertical, SearchIcon, Send, TriangleAlert, User as UserIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Inbox', href: '/inbox' }];

interface Props {
    chats: Chat[];
    currentUserId: number;
    activeChat?: Chat;
    targetUser?: User;
}

export default function Inbox({ chats, currentUserId, activeChat: initialChat, targetUser }: Props) {
    const [activeChat, setActiveChat] = useState<Chat | null>(initialChat || null);
    const [message, setMessage] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [chatsState, setChats] = useState<Chat[]>(chats);

    const messageInputRef = useRef<HTMLDivElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!activeChat && targetUser) {
            messageInputRef.current?.focus();
        }
    }, [activeChat, targetUser]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const getOtherParticipant = (chat: Chat) => chat.participants.find((p) => p.user.id !== currentUserId)?.user;

    const handleSendMessage = () => {
        if (!message.trim()) return;

        setIsSending(true);

        router.post(
            '/inbox/send-message',
            {
                chat_id: activeChat?.id,
                user_id: targetUser?.id,
                message,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setMessage('');
                    if (messageInputRef.current) messageInputRef.current.innerText = '';
                    setIsSending(false);
                },
                onError: () => setIsSending(false),
            },
        );
    };

    useEcho(`chat.${activeChat?.id}`, 'MessageSent', (e: any) => {
        setChats((prev) => {
            const idx = prev.findIndex((c) => c.id === e.message.chat_id);
            let updatedChats;

            if (idx === -1) {
                const newChat = {
                    id: e.message.chat_id,
                    participants: [{ user: { id: currentUserId } }, { user: e.user }],
                    messages: [e.message],
                    created_at: e.message.created_at || new Date().toISOString(),
                    updated_at: e.message.created_at || new Date().toISOString(),
                } as Chat;

                updatedChats = [...prev, newChat];

                if ((!activeChat && targetUser && targetUser.id === e.user.id) || (activeChat && activeChat.id === e.message.chat_id)) {
                    setActiveChat(newChat);
                }

                return updatedChats;
            }

            updatedChats = [...prev];
            const chat = updatedChats[idx];

            const existingMsg = (chat.messages || []).find((m) => m.id === e.message.id);
            if (!existingMsg) {
                updatedChats[idx] = {
                    ...chat,
                    messages: [...(chat.messages || []), e.message],
                };
            }

            if (activeChat && activeChat.id === e.message.chat_id) {
                setActiveChat((prevActive) =>
                    prevActive
                        ? {
                              ...prevActive,
                              messages: [...(prevActive.messages || []), ...(existingMsg ? [] : [e.message])],
                          }
                        : prevActive,
                );
            }

            return updatedChats;
        });
    });

    const openChat = (chatId: number) => {
        router.get(`/inbox?chat=${chatId}`, {});
    };

    useEffect(() => {
        if (activeChat?.messages?.length) {
            requestAnimationFrame(() => {
                scrollToBottom();
            });
        }
    }, [activeChat?.messages?.length]);

    // Group messages by date
    const groupMessagesByDate = () => {
        if (!activeChat?.messages?.length) return [];

        const grouped: { date: string; messages: any[] }[] = [];
        let currentGroup: any[] = [];
        let currentDate: string | null = null;

        activeChat.messages.forEach((msg, index) => {
            const msgDate = format(new Date(msg.created_at), 'yyyy-MM-dd');

            if (msgDate !== currentDate) {
                if (currentGroup.length > 0) {
                    grouped.push({ date: currentDate!, messages: [...currentGroup] });
                    currentGroup = [];
                }
                currentDate = msgDate;
            }

            currentGroup.push(msg);

            if (index === activeChat.messages.length - 1) {
                grouped.push({ date: currentDate!, messages: [...currentGroup] });
            }
        });

        return grouped;
    };

    const getDateLabel = (dateString: string) => {
        const date = new Date(dateString);
        if (isToday(date)) return 'Today';
        if (isYesterday(date)) return 'Yesterday';
        return format(date, 'MMMM d, yyyy');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Inbox" />
            <div className="bg-background flex h-[calc(100vh-80px)] overflow-hidden">
                <div className={`flex flex-col border-r bg-white ${activeChat ? 'hidden' : 'flex'} w-full lg:flex lg:w-1/3`}>
                    <div className="border-b p-4">
                        <div className="relative">
                            <SearchIcon className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                            <Input className="pl-10" type="search" placeholder="Search or start new chat" />
                        </div>
                    </div>
                    <ScrollArea>
                        <div className="space-y-1 p-2">
                            {chatsState.map((chat) => {
                                const other = getOtherParticipant(chat);
                                if (!other) return null;
                                const last = chat.messages?.at(-1)?.message || 'No messages yet';
                                const dateStr = chat.messages?.length ? format(new Date(chat.messages.at(-1)!.created_at), 'MMM dd') : '';

                                return (
                                    <div
                                        key={chat.id}
                                        onClick={() => openChat(chat.id)}
                                        className="hover:bg-muted flex cursor-pointer items-start gap-3 rounded-lg p-3"
                                    >
                                        <Avatar className="h-12 w-12">
                                            <AvatarImage src={other.avatar_url} />
                                            <AvatarFallback>
                                                {other.name
                                                    .split(' ')
                                                    .map((n) => n[0])
                                                    .join('')}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="min-w-0 flex-1">
                                            <div className="mb-1 flex justify-between">
                                                <h3 className="text-foreground truncate text-sm font-semibold">{other.name}</h3>
                                                <span className="text-muted-foreground text-xs">{dateStr}</span>
                                            </div>
                                            <p className="text-muted-foreground line-clamp-1 truncate text-sm text-wrap">{last}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </ScrollArea>
                </div>

                <div className="flex flex-1 flex-col lg:w-2/3">
                    {activeChat ? (
                        <>
                            <div className="flex items-center justify-between border-b bg-white p-4">
                                <div className="flex items-center gap-3">
                                    <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => router.get('/inbox')}>
                                        <ArrowLeft />
                                    </Button>
                                    {(() => {
                                        const usr = getOtherParticipant(activeChat);
                                        if (!usr) return null;
                                        return (
                                            <>
                                                <Avatar className="h-10 w-10">
                                                    <AvatarImage src={usr.avatar_url} />
                                                    <AvatarFallback>
                                                        {usr.name
                                                            .split(' ')
                                                            .map((n) => n[0])
                                                            .join('')}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <h3 className="text-foreground font-semibold">{usr.name}</h3>
                                            </>
                                        );
                                    })()}
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon">
                                            <EllipsisVertical />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem>
                                            <UserIcon className="mr-2 h-4 w-4" /> View Profile
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="text-destructive focus:text-destructive">
                                            <TriangleAlert className="mr-2 h-4 w-4 text-red-500" /> Report
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            <ScrollArea ref={scrollAreaRef} className="flex-1 overflow-y-auto bg-gray-100 p-4">
                                <div className="space-y-4 pb-24">
                                    {groupMessagesByDate().map((group) => (
                                        <div key={group.date}>
                                            <div className="sticky top-0 z-10 my-4 flex justify-center">
                                                <span className="text-muted-foreground rounded-full bg-gray-200 px-3 py-1 text-xs">
                                                    {getDateLabel(group.date)}
                                                </span>
                                            </div>
                                            {group.messages.map((msg) => {
                                                const isMe = msg.user_id === currentUserId;
                                                return (
                                                    <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                                        <div className="flex max-w-xs items-end gap-2 lg:max-w-lg">
                                                            {isMe && (
                                                                <span className="text-xs text-nowrap text-gray-500">
                                                                    {format(new Date(msg.created_at), 'hh:mm a')}
                                                                </span>
                                                            )}
                                                            <div
                                                                className={`rounded-tl-2xl rounded-tr-2xl px-4 py-2 ${
                                                                    isMe
                                                                        ? 'bg-primary rounded-bl-2xl text-white'
                                                                        : 'text-foreground rounded-br-2xl bg-white'
                                                                }`}
                                                            >
                                                                <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                                                            </div>
                                                            {!isMe && (
                                                                <span className="text-xs text-nowrap text-gray-500">
                                                                    {format(new Date(msg.created_at), 'hh:mm a')}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ))}
                                    <div ref={messagesEndRef} />
                                </div>
                            </ScrollArea>

                            <div className="border-t bg-white p-4">
                                <div className="relative flex items-end gap-2">
                                    <div className="relative flex-1">
                                        <div className="relative">
                                            <div
                                                ref={messageInputRef}
                                                contentEditable
                                                suppressContentEditableWarning
                                                onInput={(e) => setMessage((e.target as HTMLElement).innerText)}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter' && !e.shiftKey) {
                                                        e.preventDefault();
                                                        handleSendMessage();
                                                    }
                                                }}
                                                className="min-h-[50px] w-full resize-none overflow-y-auto rounded-full bg-white p-3 outline-none"
                                            />
                                            {message.trim() === '' && (
                                                <div className="pointer-events-none absolute inset-0 p-3 text-gray-500">Type a message...</div>
                                            )}
                                        </div>
                                        <Button
                                            onClick={handleSendMessage}
                                            disabled={isSending}
                                            size="icon"
                                            aria-label="Send message"
                                            className="absolute right-2 bottom-2"
                                        >
                                            <Send />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="hidden flex-1 items-center justify-center lg:flex">
                            <div className="text-center">
                                <MailIcon />
                                <h2 className="text-foreground mt-4 text-xl font-semibold">Message anyone</h2>
                                <p className="text-muted-foreground mt-2 max-w-lg">
                                    Connect with professionals and recruiters through meaningful conversations.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
