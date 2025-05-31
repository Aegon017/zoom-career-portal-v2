import AppLayoutTemplate from '@/layouts/app/joobseeker-sidebar-layout';
import '../assets/css/bootstrap.min.css'
import '../assets/css/style.css'
import '../assets/js/jquery.min.js'
import '../assets/js/bootstrap.min.js'
import '../assets/js/main.js'
import { ReactNode } from 'react'


interface AppLayoutProps {
    children: ReactNode;
}

const AppLayout = ({ children, ...props }: AppLayoutProps) => {
    return (
        <AppLayoutTemplate {...props}>
            <div className="zc-main">
                <div className="zc-main-wrapper py-4">
                    {children}
                </div>
            </div>
        </AppLayoutTemplate >
    );
};

export default AppLayout;
