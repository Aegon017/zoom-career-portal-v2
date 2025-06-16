import { useEffect, useState } from 'react';
import axios from 'axios';
import { usePage } from '@inertiajs/react';
import { AppNotification, SharedData } from '@/types';
import { useEchoNotification } from '@laravel/echo-react';

export default function useNotifications() {
    const { user } = usePage<SharedData>().props.auth;

    const [notifications, setNotifications] = useState<AppNotification[]>([]);
    const { listen, leaveChannel } = useEchoNotification(
        `App.Models.User.${user.id}`,
        (e: AppNotification) => {
            setNotifications((prev: AppNotification[]) => [e, ...prev]);
        },
        'new-employer.registered',
    );

    useEffect(() => {
        axios.get('/notifications')
            .then((res) => setNotifications(res.data.map((n: Notification) => n.data)))
            .catch((err) => console.error('Error fetching notifications', err));

        listen();

        return () => {
            leaveChannel();
        };
    }, []);


    return { notifications, setNotifications };
}