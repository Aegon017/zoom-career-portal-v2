import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { type BreadcrumbItem as BreadcrumbItemType } from '@/types';
import { Bell } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { ScrollArea } from './ui/scroll-area';
import { Link, usePage } from '@inertiajs/react';
import { Button } from './ui/button';
import { formatDistanceToNow } from 'date-fns';

interface NotificationData {
    type: string;
    title: string;
    message: string;
    link: string;
}

interface Notification {
    id: string;
    data: NotificationData;
    read_at: string | null;
    created_at: string;
}

export function AppSidebarHeader({ breadcrumbs = [] }: { breadcrumbs?: BreadcrumbItemType[] }) {
    const { notifications } = usePage<{ notifications: Notification[] }>().props;

    const markNotificationAsRead = (notificationId: string) => {
        console.log(notificationId);
    }

    return (
        <header className="border-sidebar-border/50 flex h-16 shrink-0 items-center gap-2 border-b px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4">
            <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>
            <Popover>
                <PopoverTrigger className="cursor-pointer ml-auto">
                    <div className="relative">
                        <Bell />
                        {notifications.filter(n => !n.read_at).length > 0 && (
                            <div className="absolute top-0 right-0">
                                <div className="relative flex items-center justify-center h-3 w-3 rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                                    <span className="absolute cursor-pointer inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
                                </div>
                            </div>
                        )}
                    </div>
                </PopoverTrigger>
                <PopoverContent className='w-sm md:w-md p-0'>
                    <div className="border-b px-4 py-3">
                        <h4 className="font-semibold">Notifications</h4>
                    </div>

                    <ScrollArea className="h-[300px]">
                        {notifications.length > 0 ? (
                            <div className="grid md:grid-cols-1 gap-1 p-2">
                                {notifications.map((notification) => {
                                    const { type, title, message, link } = notification.data;
                                    const isUnread = !notification.read_at;
                                    const createdAt = new Date(notification.created_at);
                                    return (
                                        <div
                                            key={notification.id}
                                            className="relative flex flex-col sm:flex-row items-start gap-3 rounded-xl border p-3 sm:p-4 shadow-sm transition-all duration-300 ease-in-out hover:shadow-md bg-background border-primary/30 group overflow-hidden"
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                                            <div className="flex-1 space-y-1.5 relative z-10 w-full">
                                                <div className="flex justify-between items-start sm:items-center flex-col sm:flex-row gap-1 sm:gap-2">
                                                    <p className="text-sm font-semibold text-foreground">{title}</p>
                                                    <span className="text-xs text-muted-foreground italic">
                                                        {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
                                                    </span>
                                                </div>

                                                <p className="text-xs text-muted-foreground leading-snug line-clamp-3">
                                                    {message}
                                                </p>

                                                <div className="flex gap-3 pt-1">
                                                    <Button
                                                        variant="link"
                                                        size="sm"
                                                        className="text-xs p-0 h-auto text-primary font-medium hover:underline"
                                                        onClick={() => markNotificationAsRead(notification.id)}
                                                    >
                                                        Mark as read
                                                    </Button>
                                                    <Link
                                                        href={link}
                                                        className="text-xs p-0 h-auto text-muted-foreground hover:underline underline-offset-4 font-medium transition-colors"
                                                    >
                                                        View details
                                                    </Link>
                                                </div>
                                            </div>

                                            {isUnread && (
                                                <div className="absolute top-3 right-3 flex items-center gap-1">
                                                    <span className="h-2 w-2 rounded-full bg-primary animate-ping" />
                                                    <span className="h-2 w-2 rounded-full bg-primary/80" />
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="flex h-[300px] items-center justify-center">
                                <p className="text-xs text-muted-foreground">No notifications</p>
                            </div>
                        )}
                    </ScrollArea>

                </PopoverContent>
            </Popover>
        </header>
    );
}
