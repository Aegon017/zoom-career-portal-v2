import AppLayoutTemplate from '@/layouts/app/joobseeker-sidebar-layout';
import '../assets/css/bootstrap.min.css'
import '../assets/css/style.css'
import { ReactNode, useEffect } from 'react'
import { Toaster } from '@/components/ui/sonner';
import { usePage, usePoll } from '@inertiajs/react';
import { toast } from 'sonner';


interface AppLayoutProps {
    children: ReactNode;
}

const AppLayout = ( { children, ...props }: AppLayoutProps ) => {
    const { flash } = usePage<{ flash?: { success?: string; error?: string } }>().props;
    useEffect( () => {
        if ( flash?.success ) {
            toast.success( flash.success );
        }
        if ( flash?.error ) {
            toast.error( flash.error );
        }
    }, [ flash ] );
    return (
        <AppLayoutTemplate { ...props }>
            <div className="zc-main">
                <div className="zc-main-wrapper py-4">
                    { children }
                </div>
            </div>
            <Toaster richColors position="bottom-right" closeButton={ true } />
        </AppLayoutTemplate >
    );
};

export default AppLayout;
