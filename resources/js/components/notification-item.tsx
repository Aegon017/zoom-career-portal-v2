import { router } from '@inertiajs/react';
import { formatDistanceToNow } from 'date-fns';
import { Button } from './ui/button';

const NotificationItem = ({ notification }: { notification: any }) => {
    const goToVerifcationPage = (notificationId: string, url: string) => {
        router.get(`/notifications/${notificationId}/markAsRead`);
        router.get(url);
    };

    return (
        <div className="bg-background group relative flex flex-col items-start gap-3 overflow-hidden rounded-xl border p-3 shadow-sm transition-all duration-300 ease-in-out hover:shadow-md sm:flex-row sm:p-4">
            <div className="relative z-10 w-full flex-1 space-y-1.5">
                <div className="flex flex-col items-start justify-between gap-1 sm:flex-row sm:items-center sm:gap-2">
                    <span className="text-muted-foreground text-xs italic">
                        {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                    </span>
                </div>
                <p className="text-muted-foreground line-clamp-3 text-xs leading-snug">{notification.data.message}</p>
                <div className="flex gap-3 pt-1">
                    <Button
                        variant="link"
                        onClick={() => goToVerifcationPage(notification.id, notification.data.url)}
                        className="text-primary h-auto p-0 text-xs font-medium hover:underline"
                    >
                        View details
                    </Button>
                </div>
            </div>
            {!notification.read_at && (
                <div className="absolute top-3 right-3 flex items-center gap-1">
                    <span className="bg-primary h-1 w-1 animate-ping rounded-full" />
                    <span className="bg-primary/80 h-2 w-2 rounded-full" />
                </div>
            )}
        </div>
    );
};

export default NotificationItem;
