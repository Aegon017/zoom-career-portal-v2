import useDropdown from '@/hooks/use-dropdown';
import { useInitials } from '@/hooks/use-initials';
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
import { useSidebarToggle } from '@/hooks/use-sidebar-toggle';
import { AppNotification, SharedData } from '@/types';
import { Link, router, usePage } from '@inertiajs/react';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';
import { useEffect, useState } from 'react';
import logo from '../../assets/images/logo.png';

export function AppSidebarHeader({ sidebarToggle }: { sidebarToggle: ReturnType<typeof useSidebarToggle> }) {
    const cleanup = useMobileNavigation();
    const handleLogout = () => {
        cleanup();
        router.flushAll();
    };
    const { user } = usePage<SharedData>().props.auth;

    const userNav = useDropdown<HTMLLIElement>();
    const notificationNav = useDropdown<HTMLLIElement>();

    const [notifications, setNotifications] = useState<AppNotification[]>([]);
    const getInitials = useInitials();

    useEffect(() => {
        axios
            .get('/notifications')
            .then((res) => setNotifications(res.data.map((n: AppNotification) => n)))
            .catch((err) => console.error('Error fetching notifications', err));
    }, []);

    const goToVerifcationPage = (notificationId: string, url: string) => {
        router.get(`/notifications/${notificationId}/markAsRead`);
        router.get(url);
    };

    return (
        <div className="zc-main-top-nav">
            <button className="zc-sidebar-toggle" id="zc-sidebar-toggle" ref={sidebarToggle.toggleRef} onClick={() => sidebarToggle.toggle()}>
                <i className="fa-solid fa-bars"></i>
            </button>
            <Link href="/jobseeker/explore" className="brand-logo">
                <img src={logo} alt="Zoom Career" />
            </Link>
            <ul className="zc-top-nav-bar">
                <li className="zc-nav-item zc-dropdown user-notification" ref={notificationNav.dropdownRef}>
                    <button
                        className="zc-dropdown-btn"
                        onClick={() => {
                            notificationNav.toggle();
                            userNav.close();
                        }}
                    >
                        {notifications && (
                            <div className="nicon-box">
                                <i className="fa-regular fa-bell"></i>
                                <span className="indicator">{notifications.length}</span>
                            </div>
                        )}
                    </button>
                    {notificationNav.isOpen && (
                        <div className="zc-dropdown-menu show">
                            {
                                <div className="zc-dropdown-menu-header">
                                    {notifications.length} New Notification{notifications.length !== 1 ? 's' : ''}
                                </div>
                            }
                            <div className="list-group">
                                {notifications.map((notification) => (
                                    <a
                                        onClick={() => goToVerifcationPage(notification.id, notification.data.url)}
                                        className="list-group-item cursor-pointer"
                                    >
                                        <div className="row g-0 align-items-center">
                                            <div className="text-muted small mt-1">
                                                {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                                            </div>
                                            <div className="text-dark">{notification.data.message}</div>
                                        </div>
                                        {!notification.read_at && (
                                            <div className="absolute top-3 right-3 flex items-center gap-1">
                                                <span className="bg-primary h-1 w-1 animate-ping rounded-full" />
                                                <span className="bg-primary/80 h-2 w-2 rounded-full" />
                                            </div>
                                        )}
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}
                </li>

                <li className="zc-nav-item zc-dropdown user-nav" ref={userNav.dropdownRef}>
                    <button
                        className="zc-dropdown-btn"
                        onClick={() => {
                            userNav.toggle();
                            notificationNav.close();
                        }}
                    >
                        {user.avatar_url ? (
                            <img src={user.avatar_url} />
                        ) : (
                            <div
                                className="bg-secondary d-flex align-items-center justify-content-center rounded-circle text-white"
                                style={{ width: '30px', height: '30px', fontSize: '13px' }}
                            >
                                {getInitials(user.name)}
                            </div>
                        )}
                    </button>
                    {userNav.isOpen && (
                        <div className="zc-dropdown-menu show">
                            <Link href={`/jobseeker/profile/${user.id}`} className="zc-dropdown-item">
                                <i className="fa-solid fa-id-badge me-2"></i>
                                Profile
                            </Link>
                            <Link href="/jobseeker/resumes" className="zc-dropdown-item">
                                <i className="fa-solid fa-file me-2"></i>
                                My Resumes
                            </Link>
                            {/* <Link href="/jobseeker/career-interests" className="zc-dropdown-item">
                                <i className="fa-solid fa-spa me-2"></i>
                                My Career Interests
                            </Link> */}
                            <Link className="zc-dropdown-item" method="post" href="/logout" as="button" onClick={handleLogout}>
                                <i className="fa-solid fa-right-from-bracket me-2"></i>
                                Logout
                            </Link>
                        </div>
                    )}
                </li>
            </ul>
        </div>
    );
}
