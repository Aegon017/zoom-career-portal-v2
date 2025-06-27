import { useRef, useState } from "react";
import BackIcon from "@/icons/back-icon";
import JobseekerLayout from "@/layouts/jobseeker-layout";
import { Head, router } from "@inertiajs/react";
import MailIcon from "@/icons/mail-icon";
import { Chat } from "@/types";
import { format } from "date-fns";
import SendIcon from "@/icons/send-icon";

interface Props {
    chats: Chat[];
    currentUserId: number;
}

const Inbox = ( { chats, currentUserId }: Props ) => {
    const [ activeChatId, setActiveChatId ] = useState<string | null>( null );
    const activeChat = chats.find( ( chat ) => String( chat.id ) === activeChatId );

    function getOtherParticipant( chat: Chat ) {
        return chat.participants.find( ( p ) => p.user.id !== currentUserId )?.user;
    }

    function getLastMessage( chat: Chat ) {
        if ( !chat.messages.length ) return "No messages yet";
        return chat.messages[ chat.messages.length - 1 ].message;
    }

    const messageInputRef = useRef<HTMLDivElement>( null );
    const [ isSending, setIsSending ] = useState( false );

    const handleSendMessage = () => {
        if ( !activeChatId || !messageInputRef.current ) return;

        const message = messageInputRef.current.innerText.trim();
        if ( !message ) return;

        setIsSending( true );

        router.post(
            `/jobseeker/inbox/send-message`,
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
    };


    return (
        <JobseekerLayout>
            <Head title="Inbox" />
            <div className="zc-main-wrapper">
                <div className="zc-container">
                    <div className="page-title">
                        <h2>Inbox</h2>
                    </div>
                    <div className="zc-chat-main bg-white chat-open">
                        <aside className="zc-chat-side">
                            <div className="zc-chat-side-header">
                                <div className="chat-search-widget">
                                    <input
                                        type="search"
                                        name="search-chat-list"
                                        id="search-chat-list"
                                        placeholder="Search or start new chat"
                                    />
                                </div>
                            </div>
                            <ul className="zc-chats-list">
                                { chats.map( ( chat ) => {
                                    const otherUser = getOtherParticipant( chat );
                                    if ( !otherUser ) return null;
                                    return (
                                        <li
                                            key={ chat.id }
                                            className={ `chats-item ${ activeChatId === String( chat.id ) ? "active" : "" }` }
                                            onClick={ () => setActiveChatId( String( chat.id ) ) }
                                        >
                                            <div className="chats-button" role="button">
                                                <img
                                                    src={ otherUser.profile_image }
                                                    className="user-img"
                                                    alt={ `${ otherUser.name }'s avatar` }
                                                />
                                                <div className="chats-item-info">
                                                    <div className="info-header">
                                                        <h3>{ otherUser.name }</h3>
                                                        <div className="date">
                                                            { chat.messages.length > 0
                                                                ? format( new Date( chat.messages[ chat.messages.length - 1 ].created_at ), "MMM dd" )
                                                                : "" }
                                                        </div>
                                                    </div>
                                                    {/* <h5 className="user-designation-company">{ otherUser.name }</h5> */ }
                                                    <p>{ getLastMessage( chat ) }</p>
                                                </div>
                                            </div>
                                        </li>
                                    );
                                } ) }
                            </ul>
                        </aside>
                        <div className="zc-chat-content">
                            { activeChat ? (
                                <>
                                    <div className="zc-chat-common-header">
                                        <div className="left">
                                            <div className="back-btn" onClick={ () => setActiveChatId( null ) }>
                                                <BackIcon />
                                            </div>
                                            { ( () => {
                                                const otherUser = getOtherParticipant( activeChat );
                                                if ( !otherUser ) return null;
                                                return (
                                                    <div className="user-img">
                                                        <img src={ otherUser.profile_image } alt={ `${ otherUser.name }'s avatar` } />
                                                    </div>
                                                );
                                            } )() }
                                            <div className="user-info">
                                                <h3 className="user-name">
                                                    { getOtherParticipant( activeChat )?.name || "Unknown User" }
                                                </h3>
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
                                        { activeChat.messages.length === 0 ? (
                                            <p className="text-muted p-4">No messages yet. Start the conversation!</p>
                                        ) : (
                                            activeChat.messages.map( ( msg ) => {
                                                const isCurrentUser = msg.user_id === currentUserId;
                                                return (
                                                    <div
                                                        key={ msg.id }
                                                        className={ `chat-message ${ isCurrentUser ? "sent" : "received" }` }
                                                    >
                                                        <div className="d-flex align-items-center gap-2 text-secondary text-sm">
                                                            <div className="message-bubble">{ msg.message }</div>
                                                            <small className="message-time">
                                                                { format( new Date( msg.created_at ), "hh:mm a" ) }
                                                            </small>
                                                        </div>
                                                    </div>
                                                );
                                            } )
                                        ) }
                                    </div>
                                    <div className="zc-message-box">
                                        <div
                                            ref={ messageInputRef }
                                            contentEditable={ true }
                                            className="message-type-box"
                                            data-placeholder="Type a message..."
                                        ></div>
                                        <button className="btn-send-msg" aria-label="Send message" onClick={ handleSendMessage } disabled={ isSending }>
                                            <SendIcon />
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="zc-chat-placeholder text-center p-5">
                                    <MailIcon />
                                    <h2 className="mt-4">Message anyone</h2>
                                    <p className="text-muted">
                                        Connect with professionals and recruiters to grow your career through meaningful conversations.
                                    </p>
                                </div>
                            ) }
                        </div>
                    </div>
                </div>
            </div>
        </JobseekerLayout>
    );
};

export default Inbox;
