import { Breadcrumbs } from "@/components/breadcrumbs";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
	AppNotification,
	type BreadcrumbItem as BreadcrumbItemType,
} from "@/types";
import axios from "axios";
import { Bell } from "lucide-react";
import { useEffect, useState } from "react";
import NotificationItem from "./notification-item";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { ScrollArea } from "./ui/scroll-area";
import { Link } from "@inertiajs/react";

export function AppSidebarHeader({
	breadcrumbs = [],
}: {
	breadcrumbs?: BreadcrumbItemType[];
}) {
	const [notifications, setNotifications] = useState<AppNotification[]>([]);

	useEffect(() => {
		axios
			.get("/notifications")
			.then((res) => setNotifications(res.data.map((n: Notification) => n)))
			.catch((err) => console.error("Error fetching notifications", err));
	}, []);

	return (
		<header className="border-sidebar-border/50 flex h-16 shrink-0 items-center gap-2 border-b px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4">
			<div className="flex items-center gap-2">
				<SidebarTrigger className="-ml-1" />
				<Breadcrumbs breadcrumbs={breadcrumbs} />
			</div>
			<Popover>
				<PopoverTrigger className="ml-auto cursor-pointer">
					<div className="relative">
						<Bell />
						{notifications.filter((n: AppNotification) => !n.read_at).length >
							0 && (
							<div className="absolute top-0 right-0">
								<div className="bg-primary text-primary-foreground relative flex h-3 w-3 items-center justify-center rounded-full text-[10px] font-medium">
									<span className="bg-primary absolute inline-flex h-full w-full animate-ping cursor-pointer rounded-full opacity-75"></span>
								</div>
							</div>
						)}
					</div>
				</PopoverTrigger>
				<PopoverContent className="w-sm p-0 md:w-md">
					<div className="border-b px-4 py-3">
						<h4 className="font-semibold">Notifications</h4>
					</div>

					<ScrollArea className="h-[300px]">
						{notifications.length > 0 ? (
							<div className="grid gap-1 p-2 md:grid-cols-1">
								<Link
									href="/notifications/markAllAsRead"
									className="ml-auto text-sm text-primary underline hover:text-secondary"
								>
									Clear all
								</Link>
								{notifications.map((notification: any, index: number) => {
									return (
										<NotificationItem key={index} notification={notification} />
									);
								})}
							</div>
						) : (
							<div className="flex h-[300px] items-center justify-center">
								<p className="text-muted-foreground text-xs">
									No notifications
								</p>
							</div>
						)}
					</ScrollArea>
				</PopoverContent>
			</Popover>
		</header>
	);
}
