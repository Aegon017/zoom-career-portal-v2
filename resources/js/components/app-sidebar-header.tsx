import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { type BreadcrumbItem as BreadcrumbItemType } from '@/types';
import { Bell } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { ScrollArea } from './ui/scroll-area';
import { Link, usePage } from '@inertiajs/react';
import { Button } from './ui/button';

interface NotificationData {
    title: string;
    description: string;
    link: string;
}

interface Notification {
    id: string;
    data: NotificationData;
    read_at: string | null;
}

export function AppSidebarHeader({ breadcrumbs = [] }: { breadcrumbs?: BreadcrumbItemType[] }) {
    const { notifications } = usePage<{ notifications: Notification[] }>().props;

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
                <PopoverContent className='w-md'>
                    <div className="border-b px-4 py-3">
                        <h4 className="font-semibold">Notifications</h4>
                    </div>

                    <ScrollArea className="h-[300px]">
                        {notifications.length > 0 ? (
                            <div className="grid md:grid-cols-1 gap-1 p-2">
                                {notifications.map((notification) => {
                                    const { title, description, link } = notification.data;
                                    const isUnread = !notification.read_at;

                                    return (
                                        <Link
                                            onClick={() => markNotificationAsRead(notification.id)}
                                            href={link}
                                            key={notification.id ?? title}
                                            className={`flex items-start gap-3 rounded-lg p-4 transition-colors ${isUnread ? 'bg-muted hover:bg-muted/70' : 'hover:bg-accent'
                                                }`}
                                        >
                                            <div className="flex-1">
                                                <p className="text-sm font-semibold text-foreground">
                                                    {title}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {description}
                                                </p>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                </p>
                                                <Button variant="link" className='p-0'
                                                    onClick={() => markNotificationAsRead(notification.id)}
                                                >Mark as read</Button>
                                            </div>
                                            {isUnread && (
                                                <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary" />
                                            )}
                                        </Link>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="flex h-[300px] items-center justify-center">
                                <p className="text-sm text-muted-foreground">No notifications</p>
                            </div>
                        )}
                    </ScrollArea>
                </PopoverContent>
            </Popover>
        </header>
    );
}
