import React, { useState } from 'react';
import logo from '../../assets/images/logo.png';
import ExploreIcon from '@/icons/explore-icon';
import { Link } from '@inertiajs/react';
import { useSidebarToggle } from '@/hooks/use-sidebar-toggle';
import JobsIcon from '@/icons/jobs-icon';

export function AppSidebar({ sidebarToggle }: { sidebarToggle: ReturnType<typeof useSidebarToggle> }) {
    const [activeItem, setActiveItem] = useState<string | null>(null);
    const handleDropdownToggle = (itemName: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
        setActiveItem(prev =>
            prev === itemName ? null : itemName
        );
    };

    return (
        <nav id="zc-sidebar" className={`sidebar zc-sidebar ${sidebarToggle.collapsed ? 'collapsed' : ''}`} ref={sidebarToggle.sidebarRef}>
            <div className="sidebar-content">
                <div className="sidebar-brand">
                    <Link href={route('jobseeker.explore')}>
                        <img src={logo} alt="Zoom Career" />
                    </Link>
                </div>

                <ul className="sidebar-nav">
                    <li className="sidebar-item active">
                        <Link href={route('jobseeker.explore')}>
                            <ExploreIcon />
                            <span>Explore</span>
                        </Link>
                    </li>
                    <li className="sidebar-item">
                        <a href="#">
                            <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                                <path d="M.221 16.268a15.064 15.064 0 0 0 1.789 1.9C2.008 18.111 2 18.057 2 18a5.029 5.029 0 0 1 3.233-4.678 1 1 0 0 0 .175-1.784A2.968 2.968 0 0 1 4 9a2.988 2.988 0 0 1 5.022-2.2 5.951 5.951 0 0 1 2.022-.715 4.994 4.994 0 1 0-7.913 6.085 7.07 7.07 0 0 0-2.91 4.098zM23.779 16.268a7.07 7.07 0 0 0-2.91-4.1 4.994 4.994 0 1 0-7.913-6.086 5.949 5.949 0 0 1 2.022.715 2.993 2.993 0 1 1 3.614 4.74 1 1 0 0 0 .175 1.784A5.029 5.029 0 0 1 22 18c0 .057-.008.111-.01.167a15.065 15.065 0 0 0 1.789-1.899z" />
                                <path d="M18.954 20.284a7.051 7.051 0 0 0-3.085-5.114A4.956 4.956 0 0 0 17 12a5 5 0 1 0-8.869 3.17 7.051 7.051 0 0 0-3.085 5.114 14.923 14.923 0 0 0 1.968.849C7.012 21.088 7 21.046 7 21a5.031 5.031 0 0 1 3.233-4.678 1 1 0 0 0 .175-1.785A2.964 2.964 0 0 1 9 12a3 3 0 1 1 6 0 2.964 2.964 0 0 1-1.408 2.537 1 1 0 0 0 .175 1.785A5.031 5.031 0 0 1 17 21c0 .046-.012.088-.013.133a14.919 14.919 0 0 0 1.967-.849z" />
                            </svg>
                            <span>People</span>
                        </a>
                    </li>

                    <li className={`sidebar-item has-childern ${activeItem === 'jobs' ? 'active' : ''}`}>
                        <a onClick={handleDropdownToggle('jobs')}>
                            <JobsIcon />
                            <span>Jobs</span>
                            <i className="fa-solid fa-angle-down dropdown-icon"></i>
                        </a>
                        {activeItem === 'jobs' && (
                            <ul className="sub-menu">
                                <li><Link href={route('jobseeker.jobs.index')}>All Jobs</Link></li>
                                <li><Link href={route('jobseeker.jobs.saved.index')}>Saved Jobs</Link></li>
                                <li><Link href={route('jobseeker.jobs.applied.index')}>Applied Jobs</Link></li>
                            </ul>
                        )}
                    </li>
                </ul>
            </div>
        </nav>
    );
}
