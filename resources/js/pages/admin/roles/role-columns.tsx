

import DataTableActions from '@/components/data-table-actions';
import { Badge } from '@/components/ui/badge';
import { Role } from '@/types';
import { router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';

const handleEdit = ( id: number ) => {
    router.get( `/admin/roles/${ id }/edit` );
};

const handleDelete = ( id: number ) => {
    router.delete( `/admin/roles/${ id }`, { preserveScroll: true } );
};

export const columns: ColumnDef<Role>[] = [
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
        accessorKey: 'permissions',
        header: 'Permissions',
        enableGlobalFilter: false,
        cell: ( { row } ) => (
            <Badge variant="default">
                { row.original.permissions.length }
            </Badge>
        ),
    },
    {
        id: 'actions',
        cell: ( { row } ) => {
            return <DataTableActions onEdit={ () => handleEdit( row.original.id ) } onDelete={ () => handleDelete( row.original.id ) } />;
        },
    },
];
