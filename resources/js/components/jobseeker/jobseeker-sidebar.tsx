import React, { useState } from 'react';
import logo from '../../assets/images/logo.png';
import ExploreIcon from '@/icons/explore-icon';
import { Link } from '@inertiajs/react';
import { useSidebarToggle } from '@/hooks/use-sidebar-toggle';
import JobsIcon from '@/icons/jobs-icon';
import PeopleIcon from '@/icons/people-icon';
import EmployerIcon from '@/icons/employer-icon';

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
                    <Link href={route('jobseeker.explore.index')}>
                        <img src={logo} alt="Zoom Career" />
                    </Link>
                </div>

                <ul className="sidebar-nav">
                    <li className={`sidebar-item${route().current('jobseeker.explore.index') ? ' active' : ''}`}>
                        <Link href={route('jobseeker.explore.index')}>
                            <ExploreIcon />
                            <span>Explore</span>
                        </Link>
                    </li>
                    <li className="sidebar-item">
                        <Link href={route('jobseeker.people.index')}>
                            <PeopleIcon />
                            <span>People</span>
                        </Link>
                    </li>

                    <li className={`sidebar-item has-children${activeItem === 'jobs' || route().current('jobseeker.jobs.*') ? ' active' : ''}`}>
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
                    <li className={`sidebar-item${route().current('jobseeker.employers.index') ? ' active' : ''}`}>
                        <Link href={route('jobseeker.employers.index')}>
                            <EmployerIcon />
                            <span>Employers</span>
                        </Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
}
