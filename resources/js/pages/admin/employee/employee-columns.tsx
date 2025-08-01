import DataTableActions from '@/components/data-table-actions';
import { User } from '@/types';
import { router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';

const handleShow = ( id: number ) => {
    router.get( `/admin/employees/${ id }` );
};

const handleEdit = ( id: number ) => {
    router.get( `/admin/employees/${ id }/edit` );
};

const handleDelete = ( id: number ) => {
    router.delete( `/admin/employees/${ id }` );
};

export const columns: ColumnDef<User>[] = [
    {
        accessorFn: ( row, index ) => index + 1,
        header: 'S.No.',
        enableGlobalFilter: false,
    },
    {
        accessorKey: 'name',
        header: 'Name',
        enableGlobalFilter: true,
    },
    {
        accessorKey: 'email',
        header: 'Email',
        enableGlobalFilter: true,
    },
    {
        id: 'actions',
        cell: ( { row } ) => {
            return (
                <DataTableActions
                    hasShow={ true }
                    onShow={ () => handleShow( row.original.id ) }
                    onEdit={ () => handleEdit( row.original.id ) }
                    onDelete={ () => handleDelete( row.original.id ) }
                />
            )
        },
    },
];
