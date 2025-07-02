import { Link, router, usePage } from '@inertiajs/react';
import logo from '../../assets/images/logo.png';
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
import useDropdown from '@/hooks/use-dropdown';
import { useSidebarToggle } from '@/hooks/use-sidebar-toggle';
import { AppNotification, SharedData } from '@/types';
import { useEffect, useState } from 'react';
import axios from 'axios';
import NotificationItem from '../notification-item';
import { formatDistanceToNow } from 'date-fns';

export function AppSidebarHeader( { sidebarToggle }: { sidebarToggle: ReturnType<typeof useSidebarToggle> } ) {
    const cleanup = useMobileNavigation();
    const handleLogout = () => {
        cleanup();
        router.flushAll();
    };
    const { user } = usePage<SharedData>().props.auth;


    const userNav = useDropdown<HTMLLIElement>();
    const notificationNav = useDropdown<HTMLLIElement>();

    const avatar = "https://www.w3schools.com/howto/img_avatar.png";

    const [ notifications, setNotifications ] = useState<AppNotification[]>( [] );

    useEffect( () => {
        axios.get( '/notifications' )
            .then( ( res ) => setNotifications( res.data.map( ( n: AppNotification ) => n ) ) )
            .catch( ( err ) => console.error( 'Error fetching notifications', err ) );
    }, [] );

    const goToVerifcationPage = ( notificationId: string, url: string ) => {
        router.get( `/notifications/${ notificationId }/markAsRead` );
        router.get( url );
    }

    return (
        <div className="zc-main-top-nav">
            <button className="zc-sidebar-toggle" id="zc-sidebar-toggle"
                ref={ sidebarToggle.toggleRef }
                onClick={ () => sidebarToggle.toggle() }
            >
                <i className="fa-solid fa-bars"></i>
            </button>
            <Link href="/jobseeker/explore" className="brand-logo">
                <img src={ logo } alt="Zoom Career" />
            </Link>
            <ul className="zc-top-nav-bar">
                <li className="zc-nav-item zc-dropdown user-notification" ref={ notificationNav.dropdownRef }>
                    <button className="zc-dropdown-btn" onClick={ () => {
                        notificationNav.toggle();
                        userNav.close();
                    } }>
                        {
                            notifications && <div className="nicon-box">
                                <i className="fa-regular fa-bell"></i>
                                <span className="indicator">{ notifications.length }</span>
                            </div>
                        }
                    </button>
                    { notificationNav.isOpen && (
                        <div className="zc-dropdown-menu show">
                            {
                                <div className="zc-dropdown-menu-header">
                                    { notifications.length } New Notification{ notifications.length !== 1 ? 's' : '' }
                                </div>
                            }
                            <div className="list-group">
                                { notifications.map( ( notification ) => (
                                    <a onClick={ () => goToVerifcationPage( notification.id, notification.data.url ) } className="list-group-item cursor-pointer">
                                        <div className="row g-0 align-items-center">
                                            <div className="text-muted small mt-1">{ formatDistanceToNow( new Date( notification.created_at ), { addSuffix: true } ) }</div>
                                            <div className="text-dark">{ notification.data.message }</div>
                                        </div>
                                        { !notification.read_at && (
                                            <div className="absolute top-3 right-3 flex items-center gap-1">
                                                <span className="h-1 w-1 rounded-full bg-primary animate-ping" />
                                                <span className="h-2 w-2 rounded-full bg-primary/80" />
                                            </div>
                                        ) }
                                    </a>
                                ) ) }
                            </div>
                        </div>
                    ) }
                </li>

                <li className="zc-nav-item zc-dropdown user-nav" ref={ userNav.dropdownRef }>
                    <button className="zc-dropdown-btn" onClick={ () => {
                        userNav.toggle();
                        notificationNav.close();
                    } }>
                        <img src={ avatar } />
                    </button>
                    { userNav.isOpen && (
                        <div className="zc-dropdown-menu show">
                            <Link href={ `/jobseeker/profile/${ user.id }` } className="zc-dropdown-item">
                                <i className="fa-solid fa-id-badge me-2"></i>
                                Profile
                            </Link>
                            <Link href="/jobseeker/jobs/your/applied" className="zc-dropdown-item">
                                <i className="fa-solid fa-briefcase me-2"></i>
                                My Jobs
                            </Link>
                            <Link href="/jobseeker/resumes" className="zc-dropdown-item">
                                <i className="fa-solid fa-file me-2"></i>
                                My Documents
                            </Link>
                            <a href="/jobseeker/career-interests" className="zc-dropdown-item">
                                <i className="fa-solid fa-spa me-2"></i>
                                My Career Interests
                            </a>
                            <Link
                                className="zc-dropdown-item"
                                method="post"
                                href="/logout"
                                as="button"
                                onClick={ handleLogout }
                            >
                                <i className="fa-solid fa-right-from-bracket me-2"></i>
                                Logout
                            </Link>
                        </div>
                    ) }
                </li>
            </ul>
        </div>
    );
}
