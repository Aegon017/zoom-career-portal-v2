import { useEffect, useState } from 'react';
import axios from 'axios';
import { usePage } from '@inertiajs/react';
import { SharedData } from '@/types';
import { useEcho, useEchoNotification, useEchoPublic } from '@laravel/echo-react';
import { log } from 'console';


export default function useNotifications() {
    const { user } = usePage<SharedData>().props.auth;

    const [notifications, setNotifications] = useState<Notification[]>([]);
    const { listen, leaveChannel } = useEchoNotification(
        `App.Models.User.${user.id}`,
        (e: Notification) => {
            setNotifications((prev: Notification[]) => [e, ...prev]);
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