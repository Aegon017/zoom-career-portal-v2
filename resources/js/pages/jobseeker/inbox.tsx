import BackIcon from '@/icons/back-icon';
import MailIcon from '@/icons/mail-icon';
import SendIcon from '@/icons/send-icon';
import JobseekerLayout from '@/layouts/jobseeker-layout';
import { Chat, User } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useEcho } from '@laravel/echo-react';
import { format, isToday, isYesterday } from 'date-fns';
import { useEffect, useRef, useState } from 'react';

interface Props {
    chats: Chat[];
    currentUserId: number;
    activeChat?: Chat;
    targetUser?: User;
}

const Inbox = ({ chats, currentUserId, activeChat: initialChat, targetUser }: Props) => {
    const [activeChat, setActiveChat] = useState<Chat | null>(initialChat || null);
    const [message, setMessage] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [chatsState, setChats] = useState<Chat[]>(chats);

    const messageInputRef = useRef<HTMLDivElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

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
        <JobseekerLayout>
            <Head title="Inbox" />
            <div className="zc-main-wrapper">
                <div className="zc-container">
                    <div className="page-title">
                        <h2>Inbox</h2>
                    </div>
                    <div className="zc-chat-main chat-open bg-white">
                        <aside className="zc-chat-side">
                            <div className="zc-chat-side-header">
                                <div className="chat-search-widget">
                                    <input type="search" placeholder="Search or start new chat" />
                                </div>
                            </div>
                            <ul className="zc-chats-list">
                                {chatsState.map((chat) => {
                                    const other = getOtherParticipant(chat);
                                    if (!other) return null;
                                    const last = chat.messages?.at(-1)?.message || 'No messages yet';
                                    const dateStr = chat.messages?.length ? format(new Date(chat.messages.at(-1)!.created_at), 'MMM dd') : '';

                                    return (
                                        <li
                                            key={chat.id}
                                            className={`chats-item ${activeChat?.id === chat.id ? 'active' : ''}`}
                                            onClick={() => router.get(`/inbox?chat=${chat.id}`, {})}
                                        >
                                            <div className="chats-button" role="button">
                                                <img src={other.avatar_url} className="user-img" alt={`${other.name}'s avatar`} />
                                                <div className="chats-item-info">
                                                    <div className="info-header">
                                                        <h3>{other.name}</h3>
                                                        <div className="date">{dateStr}</div>
                                                    </div>
                                                    <p className="line-clamp-1">{last}</p>
                                                </div>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        </aside>

                        <div className={`zc-chat-content ${activeChat ? 'show' : ''}`}>
                            {activeChat ? (
                                <>
                                    <div className="zc-chat-common-header">
                                        <div className="left">
                                            <div className="back-btn" onClick={() => router.get('/inbox')}>
                                                <BackIcon />
                                            </div>
                                            {(() => {
                                                const usr = getOtherParticipant(activeChat);
                                                if (!usr) return null;
                                                return (
                                                    <div className="user-img">
                                                        <img src={usr.avatar_url} alt={`${usr.name}'s avatar`} />
                                                    </div>
                                                );
                                            })()}
                                            <div className="user-info">
                                                <h3 className="user-name">{getOtherParticipant(activeChat)?.name || 'Unknown User'}</h3>
                                            </div>
                                        </div>
                                        <div className="right">
                                            <div className="zc-chat-user-menu">
                                                <div className="menu-toggle">
                                                    <i className="fa-solid fa-ellipsis-vertical"></i>
                                                </div>
                                                <ul className="user-dropdown-menu">
                                                    <li>
                                                        <a href="#">
                                                            <i className="fa-regular fa-user"></i>View Profile
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <a href="#">
                                                            <i className="fa-solid fa-triangle-exclamation"></i>Report
                                                        </a>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="zc-messanger">
                                        {activeChat.messages.length === 0 ? (
                                            <p className="text-muted p-4">No messages yet. Start the conversation!</p>
                                        ) : (
                                            groupMessagesByDate().map((group) => (
                                                <div key={group.date}>
                                                    <div className="date-divider">
                                                        <span className="date-label">{getDateLabel(group.date)}</span>
                                                    </div>
                                                    {group.messages.map((msg) => {
                                                        const isMe = msg.user_id === currentUserId;
                                                        return (
                                                            <div key={msg.id} className={`chat-message my-3 ${isMe ? 'me' : 'other'}`}>
                                                                <div className="d-flex align-items-end text-secondary gap-2 text-sm">
                                                                    {isMe ? (
                                                                        <>
                                                                            <small className="text-secondary">
                                                                                {format(new Date(msg.created_at), 'hh:mm a')}
                                                                            </small>
                                                                            <div className="message-bubble">{msg.message}</div>
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <div className="message-bubble">{msg.message}</div>
                                                                            <small className="text-secondary">
                                                                                {format(new Date(msg.created_at), 'hh:mm a')}
                                                                            </small>
                                                                        </>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            ))
                                        )}
                                        <div ref={messagesEndRef} />
                                    </div>

                                    <div className="zc-message-box d-flex align-items-center">
                                        <div
                                            ref={messageInputRef}
                                            contentEditable
                                            className="message-type-box"
                                            data-placeholder="Type a message..."
                                            onInput={(e) => setMessage((e.target as HTMLElement).innerText)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' && !e.shiftKey) {
                                                    e.preventDefault();
                                                    handleSendMessage();
                                                }
                                            }}
                                        />
                                        <button className="btn-send-msg" aria-label="Send message" onClick={handleSendMessage} disabled={isSending}>
                                            <SendIcon />
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="m-auto p-5 text-center">
                                    <MailIcon />
                                    <h2 className="mt-4">Message anyone</h2>
                                    <p className="text-muted">
                                        Connect with professionals and recruiters to grow your career through meaningful conversations.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </JobseekerLayout>
    );
};

export default Inbox;
