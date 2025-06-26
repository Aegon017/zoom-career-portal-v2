import { NavItem, SharedData } from "@/types";
import { ChartBar, ClipboardList, CodeXml, Factory, LayoutGrid, ListTree, MapPin, Settings2, TableProperties, Users2 } from "lucide-react";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuItem } from "./ui/sidebar";
import { Link, usePage } from "@inertiajs/react";
import AppLogo from "./app-logo";
import { NavMain } from "./nav-main";
import { NavFooter } from "./nav-footer";
import { Separator } from "./ui/separator";
import { NavUser } from "./nav-user";
import useRoles from "@/hooks/use-roles";

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
                }, {
                    title: 'Roles',
                    href: '',
                },
            ]
        },
        {
            title: 'Employer',
            href: '',
            icon: Users2,
            items: [
                {
                    title: 'Employee',
                    href: '/admin/employee',
                }, {
                    title: 'Companies',
                    href: '/admin/companies',
                },
            ]
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
            title: 'Talent Profiles',
            href: '/admin/talent-profiles',
            icon: ClipboardList,
        },
        {
            title: 'Industries',
            href: '/admin/industries',
            icon: Factory,
        }, {
            title: 'Job functions',
            href: '/admin/job-functions',
            icon: ListTree,
        },
        {
            title: 'Job types',
            href: '/admin/job-types',
            icon: TableProperties,
        },
        {
            title: 'Locations',
            href: '/admin/locations',
            icon: MapPin,
        },
    ];

    const footerNavItems: NavItem[] = [
        {
            title: 'Site settings',
            href: '/admin/site-settings',
            icon: Settings2,
        }
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <Link href="/dashboard">
                            <AppLogo />
                        </Link>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} groupName="Admin Panel" />
            </SidebarContent>

            <SidebarFooter>
                <Separator />
                <NavFooter items={footerNavItems} className="mt-auto" />
                <Separator />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
