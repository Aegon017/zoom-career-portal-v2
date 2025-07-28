'use client';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User } from '@/types';
import { router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';

const goToShow = ( id: number ) => {
    router.get( `/admin/students/${ id }` );
};

export const columns: ColumnDef<User>[] = [
    {
        accessorFn: ( row, index ) => index + 1,
        header: 'S.No.',
    },
    {
        accessorKey: 'name',
        header: 'Name',
        enableGlobalFilter: true,
    },
    {
        id: 'actions',
        cell: ( { row } ) => {
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            className="text-foreground hover:bg-muted cursor-pointer text-sm transition-colors"
                            onClick={ () => goToShow( row.original.id ) }
                        >
                            Show
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
