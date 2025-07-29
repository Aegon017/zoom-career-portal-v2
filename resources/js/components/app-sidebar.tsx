import useRoles from '@/hooks/use-roles';
import { NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BriefcaseBusiness, ChartBar, CodeXml, Factory, GraduationCap, Languages, LayoutGrid, MapPin, Notebook, Settings2, Users2 } from 'lucide-react';
import AppLogo from './app-logo';
import { NavFooter } from './nav-footer';
import { NavMain } from './nav-main';
import { NavUser } from './nav-user';
import { Separator } from './ui/separator';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuItem } from './ui/sidebar';

export function AppSidebar() {
    const roles = useRoles();

    const mainNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: '/admin/dashboard',
            icon: LayoutGrid,
        },
        {
            title: 'User Management',
            href: '',
            icon: Users2,
            items: [
                {
                    title: 'Users',
                    href: '/admin/users',
                },
                {
                    title: 'Roles',
                    href: '/admin/roles',
                },
            ],
        },
        {
            title: 'Employer',
            href: '',
            icon: Users2,
            items: [
                {
                    title: 'Employees',
                    href: '/admin/employees',
                },
                {
                    title: 'Companies',
                    href: '/admin/companies',
                },
            ],
        },
        {
            title: 'Student Management',
            href: '/admin/students',
            icon: GraduationCap,
        },
        {
            title: 'Job Management',
            href: '/admin/jobs',
            icon: BriefcaseBusiness,
        },
        {
            title: 'Skills',
            href: '/admin/skills',
            icon: CodeXml,
        },
        {
            title: 'Job Titles',
            href: '/admin/job-titles',
            icon: ChartBar,
        },
        {
            title: 'Industries',
            href: '/admin/industries',
            icon: Factory,
        },
        {
            title: 'Locations',
            href: '/admin/locations',
            icon: MapPin,
        },
        {
            title: 'Languages',
            href: '/admin/languages',
            icon: Languages,
        },
        {
            title: 'Feedback',
            href: '/admin/feedback',
            icon: Notebook,
        },
    ];

    const footerNavItems: NavItem[] = [
        // {
        //     title: 'Site settings',
        //     href: '/admin/site-settings',
        //     icon: Settings2,
        // },
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <Link href="/admin/dashboard">
                            <AppLogo />
                        </Link>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={ mainNavItems } groupName="Admin Panel" />
            </SidebarContent>

            <SidebarFooter>
                <Separator />
                <NavFooter items={ footerNavItems } className="mt-auto" />
                <Separator />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
