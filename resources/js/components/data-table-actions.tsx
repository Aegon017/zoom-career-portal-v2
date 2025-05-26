import React, { useState } from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Button } from './ui/button';
import { MoreHorizontal } from 'lucide-react';
import DeleteAlert from './delete-alert';

interface DataTableActionsProps {
    onEdit: () => void;
    onDelete: () => void;
}

const DataTableActions = ({ onEdit, onDelete }: DataTableActionsProps) => {

    const [alertOpen, setAlertOpen] = useState<boolean>(false);

    return (
        <>
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
                    <DropdownMenuItem className="cursor-pointer" onClick={() => onEdit()}>Edit</DropdownMenuItem>
                    <DropdownMenuItem className="bg-red-600 focus:bg-red-500 dark:focus:bg-red-700 focus:text-white dark:focus:text-black text-white dark:text-black cursor-pointer" onClick={() => setTimeout(() => setAlertOpen(true), 0)}>Delete</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu >
            <DeleteAlert alertOpen={alertOpen} setAlertOpen={setAlertOpen} onDelete={onDelete} />
        </>
    )
}

export default DataTableActions