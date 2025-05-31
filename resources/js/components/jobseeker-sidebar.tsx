import React, { useState } from 'react';
import logo from '../assets/images/logo.png';
import JobsIcon from '@/icons/jobs-icon';
import ExploreIcon from '@/icons/explore-icon';
import { Link } from '@inertiajs/react';

export function AppSidebar() {
    const [activeItem, setActiveItem] = useState<string | null>(null);
    const handleDropdownToggle = (itemName: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
        setActiveItem(prev =>
            prev === itemName ? null : itemName
        );
    };

    return (
        <nav id="zc-sidebar" className="sidebar zc-sidebar">
            <div className="sidebar-content">
                <div className="sidebar-brand">
                    <Link href={route('dashboard')}>
                        <img src={logo} alt="Zoom Career" />
                    </Link>
                </div>

                <ul className="sidebar-nav">
                    <li className="sidebar-item active">
                        <Link href={route('dashboard')}>
                            <ExploreIcon />
                            <span>Explore</span>
                        </Link>
                    </li>

                    <li className={`sidebar-item has-childern ${activeItem === 'jobs' ? 'active' : ''}`}>
                        <a href='#' onClick={handleDropdownToggle('jobs')}>
                            <JobsIcon />
                            <span>Jobs</span>
                            <i className="fa-solid fa-angle-down dropdown-icon"></i>
                        </a>
                        {activeItem === 'jobs' && (
                            <ul className="sub-menu">
                                <li><a href="jobs.php">All Jobs</a></li>
                                <li><a href="saved-jobs.php">Saved Jobs</a></li>
                                <li><a href="applied-jobs.php">Applied Jobs</a></li>
                                <li><a href="job-details.php">Job Details</a></li>
                            </ul>
                        )}
                    </li>
                </ul>
            </div>
        </nav>
    );
}
