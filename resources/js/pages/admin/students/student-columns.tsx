import DataTableActions from '@/components/data-table-actions';
import { User } from '@/types';
import { router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';

const handleEdit = ( id: number ) => {
    router.get( `/admin/students/${ id }/edit` );
};

const handleDelete = ( id: number ) => {
    router.delete( `/admin/students/${ id }` );
};

const handleShow = ( id: number ) => {
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
            return <DataTableActions hasShow={ true } onEdit={ () => handleEdit( row.original.id ) } onDelete={ () => handleDelete( row.original.id ) } onShow={ () => handleShow( row.original.id ) } />;
        },
    },
];
