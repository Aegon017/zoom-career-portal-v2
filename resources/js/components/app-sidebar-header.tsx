import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Notification, type BreadcrumbItem as BreadcrumbItemType } from '@/types';
import { Bell } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { ScrollArea } from './ui/scroll-area';
import { Link, usePage } from '@inertiajs/react';
import { Button } from './ui/button';
import { formatDistanceToNow } from 'date-fns';
import NotificationItem from './notification-item';

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
                <PopoverContent className='w-sm md:w-md p-0'>
                    <div className="border-b px-4 py-3">
                        <h4 className="font-semibold">Notifications</h4>
                    </div>

                    <ScrollArea className="h-[300px]">
                        {notifications.length > 0 ? (
                            <div className="grid md:grid-cols-1 gap-1 p-2">
                                {notifications.map((notification) => {
                                    return (
                                        <NotificationItem key={notification.id} notification={notification} />
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
