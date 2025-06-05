import { NavItem } from "@/types";
import { BriefcaseBusiness, LayoutGrid } from "lucide-react";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuItem } from "../ui/sidebar";
import { Link } from "@inertiajs/react";
import AppLogo from "../app-logo";
import { NavMain } from "../nav-main";
import { NavFooter } from "../nav-footer";
import { Separator } from "../ui/separator";
import { NavUser } from "../nav-user";

export function AppSidebar() {
    const mainNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: '/employer/dashboard',
            icon: LayoutGrid,
        },
        {
            title: 'Jobs',
            href: '/employer/jobs',
            icon: BriefcaseBusiness,
        }
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
