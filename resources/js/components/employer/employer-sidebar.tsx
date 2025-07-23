import { NavItem, SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BookUser, BriefcaseBusiness, LayoutGrid, LayoutList, MailOpen } from 'lucide-react';
import AppLogo from '../app-logo';
import { NavFooter } from '../nav-footer';
import { NavMain } from '../nav-main';
import { NavUser } from '../nav-user';
import { Separator } from '../ui/separator';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuItem } from '../ui/sidebar';

export function AppSidebar() {
    const isVerified = usePage<SharedData>().props.auth.isEmployerVerified;

    const mainNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: '/employer/dashboard',
            icon: LayoutGrid,
        },
        ...(isVerified
            ? [
                  {
                      title: 'Inbox',
                      href: '/inbox',
                      icon: MailOpen,
                  },
                  {
                      title: 'Jobs',
                      href: '/employer/jobs',
                      icon: BriefcaseBusiness,
                  },
                  {
                      title: 'Jobseekers',
                      href: '/employer/jobseekers',
                      icon: BookUser,
                  },
                  {
                      title: 'Applications',
                      href: '/employer/applications',
                      icon: LayoutList,
                  },
              ]
            : []),
    ];

    const footerNavItems: NavItem[] = [];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <Link href="/employer/dashboard">
                            <AppLogo />
                        </Link>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} groupName="Employer Panel" />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <Separator />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
