import { AppNotification } from '@/types'
import { formatDistanceToNow } from 'date-fns'
import { Button } from './ui/button'
import { Link, router } from '@inertiajs/react'

const NotificationItem = ({ notification }: { notification: any }) => {
    const markNotificationAsRead = (notificationId: string) => {
        router.get(route('notifications.markAsRead', notificationId));
    }
    return (
        <div
            className="relative flex flex-col sm:flex-row items-start gap-3 rounded-xl border p-3 sm:p-4 shadow-sm transition-all duration-300 ease-in-out hover:shadow-md bg-background group overflow-hidden"
        >
            <div className="flex-1 space-y-1.5 relative z-10 w-full">
                <div className="flex justify-between items-start sm:items-center flex-col sm:flex-row gap-1 sm:gap-2">
                    <p className="text-sm font-semibold text-foreground">{notification.employer_name}</p>
                    <span className="text-xs text-muted-foreground italic">
                        {formatDistanceToNow(new Date(notification.registered_at), { addSuffix: true })}
                    </span>
                </div>

                <p className="text-xs text-muted-foreground leading-snug line-clamp-3">
                    {notification.message}
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
                        href={notification.url}
                        className="text-xs p-0 h-auto text-muted-foreground hover:underline underline-offset-4 font-medium transition-colors"
                    >
                        View details
                    </Link>
                </div>
            </div>

            {!notification.read_at && (
                <div className="absolute top-3 right-3 flex items-center gap-1">
                    <span className="h-1 w-1 rounded-full bg-primary animate-ping" />
                    <span className="h-2 w-2 rounded-full bg-primary/80" />
                </div>
            )}
        </div>
    )
}

export default NotificationItem