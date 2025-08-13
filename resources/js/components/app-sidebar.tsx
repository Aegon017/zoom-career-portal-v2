import useRoles from '@/hooks/use-roles';
import { NavItem, SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BriefcaseBusiness, ChartBar, CodeXml, Factory, GraduationCap, Languages, LayoutGrid, MapPin, Notebook, Settings2, Users2 } from 'lucide-react';
import AppLogo from './app-logo';
import { NavFooter } from './nav-footer';
import { NavMain } from './nav-main';
import { NavUser } from './nav-user';
import { Separator } from './ui/separator';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuItem } from './ui/sidebar';

export function AppSidebar() {
    const roles = useRoles();
    const { auth } = usePage<SharedData>().props;
    const permissions = auth?.permissions || [];
    const can = ( permission: string ) => permissions.includes( permission );

    const mainNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: '/admin/dashboard',
            icon: LayoutGrid,
        },
        ( can( 'view_any_user' ) && can( 'view_any_role' ) ) && {
            title: 'User Management',
            href: '',
            icon: Users2,
            items: [
                can( 'view_any_user' ) && { title: 'Users', href: '/admin/users' },
                can( 'view_any_role' ) && { title: 'Roles', href: '/admin/roles' },
            ],
        },
        {
            title: 'Employer',
            href: '',
            icon: Users2,
            items: [
                { title: 'Employees', href: '/admin/employees' },
                { title: 'Companies', href: '/admin/companies' },
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
        can( 'view_any_skill' ) && {
            title: 'Skills',
            href: '/admin/skills',
            icon: CodeXml,
        },
        can( 'view_any_opening_title' ) && {
            title: 'Job Titles',
            href: '/admin/job-titles',
            icon: ChartBar,
        },
        can( 'view_any_industry' ) && {
            title: 'Industries',
            href: '/admin/industries',
            icon: Factory,
        },
        can( 'view_any_location' ) && {
            title: 'Locations',
            href: '/admin/locations',
            icon: MapPin,
        },
        can( 'view_any_language' ) && {
            title: 'Languages',
            href: '/admin/languages',
            icon: Languages,
        },
        can( 'view_any_feedback' ) && {
            title: 'Feedback',
            href: '/admin/feedback',
            icon: Notebook,
        },
    ].filter( Boolean ) as NavItem[];

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
