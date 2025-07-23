import { MoreHorizontal } from 'lucide-react';
import { useState } from 'react';
import DeleteAlert from './delete-alert';
import { Button } from './ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from './ui/dropdown-menu';

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
                    <DropdownMenuItem className="mb-1 cursor-pointer" onClick={() => onEdit()}>
                        Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        className="cursor-pointer bg-red-600 text-white focus:bg-red-500 focus:text-white dark:text-black dark:focus:bg-red-700 dark:focus:text-black"
                        onClick={() => setTimeout(() => setAlertOpen(true), 0)}
                    >
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <DeleteAlert alertOpen={alertOpen} setAlertOpen={setAlertOpen} onDelete={onDelete} />
        </>
    );
};

export default DataTableActions;
