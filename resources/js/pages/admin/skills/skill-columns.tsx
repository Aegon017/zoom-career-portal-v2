import DataTableActions from '@/components/data-table-actions';
import { Checkbox } from '@/components/ui/checkbox';
import { Skill } from '@/types';
import { router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';

const handleEdit = ( id: number ) => {
    router.get( `/admin/skills/${ id }/edit` );
};

const handleDelete = ( id: number ) => {
    router.delete( `/admin/skills/${ id }`, { preserveScroll: true } );
};

export const columns: ColumnDef<Skill>[] = [
    {
        id: "select",
        header: ( { table } ) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    ( table.getIsSomePageRowsSelected() && "indeterminate" )
                }
                onCheckedChange={ ( value ) => table.toggleAllPageRowsSelected( !!value ) }
                aria-label="Select all"
            />
        ),
        cell: ( { row } ) => (
            <Checkbox
                checked={ row.getIsSelected() }
                onCheckedChange={ ( value ) => row.toggleSelected( !!value ) }
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
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
        id: 'actions',
        cell: ( { row } ) => {
            return <DataTableActions onEdit={ () => handleEdit( row.original.id ) } onDelete={ () => handleDelete( row.original.id ) } />;
        },
    },
];
