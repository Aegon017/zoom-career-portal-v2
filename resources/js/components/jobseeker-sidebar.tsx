import React, { useState } from 'react';
import logo from '../assets/images/logo.png';
import JobsIcon from '@/icons/jobs-icon';
import ExploreIcon from '@/icons/explore-icon';
import { Link } from '@inertiajs/react';
import { useSidebarToggle } from '@/hooks/use-sidebar-toggle';

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

                    <li className={`sidebar-item has-childern ${activeItem === 'jobs' ? 'active' : ''}`}>
                        <a onClick={handleDropdownToggle('jobs')}>
                            <JobsIcon />
                            <span>Jobs</span>
                            <i className="fa-solid fa-angle-down dropdown-icon"></i>
                        </a>
                        {activeItem === 'jobs' && (
                            <ul className="sub-menu">
                                <li><Link href={route('jobseeker.jobs.index')}>All Jobs</Link></li>
                                <li><Link href={route('jobseeker.saved-jobs.index')}>Saved Jobs</Link></li>
                                <li><Link href={route('jobseeker.applied-jobs.index')}>Applied Jobs</Link></li>
                            </ul>
                        )}
                    </li>
                </ul>
            </div>
        </nav>
    );
}
