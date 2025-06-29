import { DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { UserInfo } from '@/components/user-info';
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
import useRoles from '@/hooks/use-roles';
import { type User } from '@/types';
import { Link, router } from '@inertiajs/react';
import { Building2, LogOut, Settings, UserPen } from 'lucide-react';

interface UserMenuContentProps {
    user: User;
}

export function UserMenuContent( { user }: UserMenuContentProps ) {
    const { isSuperAdmin, isEmployer, isJobSeeker } = useRoles();

    const profileLink = isSuperAdmin ? "/settings/profile" : "/employer/settings/profile";

    const cleanup = useMobileNavigation();

    const handleLogout = () => {
        cleanup();
        router.flushAll();
    };

    return (
        <>
            <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <UserInfo user={ user } showEmail={ true } />
                </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {
                isEmployer && (
                    <>
                        <DropdownMenuGroup>
                            <DropdownMenuItem asChild>
                                <Link className="block w-full" href="/employer/company" as="button" prefetch onClick={ cleanup }>
                                    <Building2 className="mr-2" />
                                    company profile
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                    </>

                )
            }
            <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                    <Link className="block w-full" href={ profileLink } as="button" prefetch onClick={ cleanup }>
                        <Settings className="mr-2" />
                        Settings
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
                <Link className="block w-full" method="post" href="/logout" as="button" onClick={ handleLogout }>
                    <LogOut className="mr-2" />
                    Log out
                </Link>
            </DropdownMenuItem>
        </>
    );
}
