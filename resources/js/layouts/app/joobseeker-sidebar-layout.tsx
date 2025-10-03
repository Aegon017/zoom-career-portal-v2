import { AppContent } from "@/components/app-content";
import { AppShell } from "@/components/app-shell";
import { AppSidebar } from "@/components/jobseeker/jobseeker-sidebar";
import { AppSidebarHeader } from "@/components/jobseeker/jobseeker-sidebar-header";
import { useSidebarToggle } from "@/hooks/use-sidebar-toggle";
import { type PropsWithChildren } from "react";

export default function AppSidebarLayout({ children }: PropsWithChildren) {
	const sidebarToggle = useSidebarToggle();
	return (
		<AppShell variant="sidebar">
			<AppSidebar sidebarToggle={sidebarToggle} />
			<AppContent variant="sidebar">
				<AppSidebarHeader sidebarToggle={sidebarToggle} />
				{children}
			</AppContent>
		</AppShell>
	);
}
