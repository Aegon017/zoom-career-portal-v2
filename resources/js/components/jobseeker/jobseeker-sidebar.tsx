import { useSidebarToggle } from "@/hooks/use-sidebar-toggle";
import EmployerIcon from "@/icons/employer-icon";
import JobsIcon from "@/icons/jobs-icon";
import PeopleIcon from "@/icons/people-icon";
import { SharedData } from "@/types";
import { Link, usePage } from "@inertiajs/react";
import React, { useState } from "react";

type SidebarItem = {
	key: string;
	icon: React.ReactNode;
	label: string;
	href?: string;
	children?: { label: string; href: string }[];
	isActive?: boolean;
};

export function AppSidebar({
	sidebarToggle,
}: {
	sidebarToggle: ReturnType<typeof useSidebarToggle>;
}) {
	const { features } = usePage<SharedData>().props;
	const sidebarItems: SidebarItem[] = [
		{
			key: "dashboard",
			icon: <i className="fa-solid fa-house-chimney mr-2"></i>,
			label: "Dashboard",
			href: "/jobseeker/dashboard",
			isActive: window.location.pathname === "/jobseeker/dashboard",
		},
		{
			key: "inbox",
			icon: <i className="fa-solid fa-envelope-open-text mr-2"></i>,
			label: "Inbox",
			href: "/inbox",
			isActive: window.location.pathname === "/inbox",
		},
		features.people_feature
			? {
					key: "people",
					icon: <PeopleIcon />,
					label: "People",
					href: "/jobseeker/people",
					isActive: window.location.pathname === "/jobseeker/people",
				}
			: null,
		{
			key: "jobs",
			icon: <JobsIcon />,
			label: "Jobs",
			children: [
				{ label: "All Jobs", href: "/jobseeker/jobs" },
				{ label: "Saved Jobs", href: "/jobseeker/jobs/your/saved" },
				{ label: "Applied Jobs", href: "/jobseeker/jobs/your/applied" },
			],
			isActive: window.location.pathname === "/jobseeker/jobs/*",
		},
		{
			key: "employers",
			icon: <EmployerIcon />,
			label: "Employers",
			href: "/jobseeker/employers",
			isActive: window.location.pathname === "/jobseeker/employers",
		},
	].filter(Boolean) as SidebarItem[];
	const [activeItem, setActiveItem] = useState<string | null>(null);

	const handleDropdownToggle =
		(itemKey: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
			e.preventDefault();
			setActiveItem((prev) => (prev === itemKey ? null : itemKey));
		};

	return (
		<nav
			id="zc-sidebar"
			className={`sidebar zc-sidebar ${sidebarToggle.collapsed ? "collapsed" : ""}`}
			ref={sidebarToggle.sidebarRef}
		>
			<div className="sidebar-content">
				<div className="sidebar-brand">
					<Link href="/jobseeker/dashboard">
						<img src="/logo.png" alt="Zoom Career" />
					</Link>
				</div>
				<ul className="sidebar-nav">
					{sidebarItems.map((item) => (
						<li
							key={item.key}
							className={`sidebar-item ${item.children ? "has-children" : ""}${item.isActive || activeItem === item.key ? "active" : ""}`}
						>
							{item.children ? (
								<>
									<a onClick={handleDropdownToggle(item.key)} href="#">
										{item.icon}
										<span>{item.label}</span>
										<i className="fa-solid fa-angle-down dropdown-icon"></i>
									</a>
									{activeItem === item.key && (
										<ul className="sub-menu">
											{item.children.map((child) => (
												<li key={child.href}>
													<Link href={child.href}>{child.label}</Link>
												</li>
											))}
										</ul>
									)}
								</>
							) : (
								<Link href={item.href!}>
									{item.icon}
									<span>{item.label}</span>
								</Link>
							)}
						</li>
					))}
				</ul>
			</div>
		</nav>
	);
}
