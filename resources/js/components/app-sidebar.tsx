import { NavItem } from "@/types";
import { BriefcaseBusiness, CodeXml, LayoutGrid, Users2 } from "lucide-react";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuItem } from "./ui/sidebar";
import { Link } from "@inertiajs/react";
import AppLogo from "./app-logo";
import { NavMain } from "./nav-main";
import { NavFooter } from "./nav-footer";
import { Separator } from "./ui/separator";
import { NavUser } from "./nav-user";
import useRoles from "@/hooks/use-roles";
import { useSidebarToggle } from "@/hooks/use-sidebar-toggle";

export function AppSidebar() {
    const { isEmployer, isJobSeeker, isSuperAdmin } = useRoles();

    const mainNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: '/dashboard',
            icon: LayoutGrid,
        },
        ...(isSuperAdmin ? [
            {
                title: 'Users',
                href: route('users.index'),
                icon: Users2,
            },
            {
                title: 'Skills',
                href: route('skills.index'),
                icon: CodeXml,
            },
            {
                title: 'Jobs',
                href: route('job-postings.index'),
                icon: BriefcaseBusiness,
            }
        ] : []),
        ...(isEmployer ? [
            {
                title: 'Jobs',
                href: route('job-postings.index'),
                icon: BriefcaseBusiness,
            }
        ] : [])
    ];

    const footerNavItems: NavItem[] = [];

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
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <Separator />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
