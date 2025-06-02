import { Link, router } from '@inertiajs/react';
import logo from '../assets/images/logo.png';
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
import useDropdown from '@/hooks/use-dropdown';
import { useSidebarToggle } from '@/hooks/use-sidebar-toggle';

export function AppSidebarHeader({ sidebarToggle }: { sidebarToggle: ReturnType<typeof useSidebarToggle> }) {
    const cleanup = useMobileNavigation();
    const handleLogout = () => {
        cleanup();
        router.flushAll();
    };

    const userNav = useDropdown<HTMLLIElement>();
    const notificationNav = useDropdown<HTMLLIElement>();

    const avatar = "https://www.w3schools.com/howto/img_avatar.png";
    return (
        <div className="zc-main-top-nav">
            <button className="zc-sidebar-toggle" id="zc-sidebar-toggle"
                ref={sidebarToggle.toggleRef}
                onClick={() => sidebarToggle.toggle()}
            >
                <i className="fa-solid fa-bars"></i>
            </button>
            <Link href={route('jobseeker.explore')} className="brand-logo">
                <img src={logo} alt="Zoom Career" />
            </Link>
            <ul className="zc-top-nav-bar">
                <li className="zc-nav-item zc-dropdown user-notification" ref={notificationNav.dropdownRef}>
                    <button className="zc-dropdown-btn" onClick={() => {
                        notificationNav.toggle();
                        userNav.close();
                    }}>
                        <div className="nicon-box">
                            <i className="fa-regular fa-bell"></i>
                            <span className="indicator">4</span>
                        </div>
                    </button>
                    {notificationNav.isOpen && (
                        <div className="zc-dropdown-menu show">
                            <div className="zc-dropdown-menu-header">4 New Notifications</div>
                            <div className="list-group">
                            </div>
                            <div className="zc-dropdown-menu-footer">
                                <a href="#" className="text-muted">Show all notifications</a>
                            </div>
                        </div>
                    )}
                </li>

                <li className="zc-nav-item zc-dropdown user-nav" ref={userNav.dropdownRef}>
                    <button className="zc-dropdown-btn" onClick={() => {
                        userNav.toggle();
                        notificationNav.close();
                    }}>
                        <img src={avatar} />
                    </button>
                    {userNav.isOpen && (
                        <div className="zc-dropdown-menu show">
                            <Link href={route('jobseeker.profile.index')} className="zc-dropdown-item">
                                <i className="fas fa-user"></i>
                                Profile
                            </Link>
                            <a href="#" className="zc-dropdown-item">
                                <i className="fas fa-user"></i>
                                My Jobs
                            </a>
                            <a href="#" className="zc-dropdown-item">
                                <i className="fas fa-user"></i>
                                My Documents
                            </a>
                            <a href="#" className="zc-dropdown-item">
                                <i className="fas fa-user"></i>
                                My Career Interests
                            </a>
                            <Link
                                className="zc-dropdown-item"
                                method="post"
                                href={route('logout')}
                                as="button"
                                onClick={handleLogout}
                            >
                                <i className="fa-solid fa-arrow-right-from-bracket"></i>
                                Logout
                            </Link>
                        </div>
                    )}
                </li>
            </ul>
        </div>
    );
}
