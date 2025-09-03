

import DataTableActions from '@/components/data-table-actions';
import { Opening } from '@/types';
import { router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';

const handleEdit = ( id: number ) => {
    router.get( `/employer/jobs/${ id }/edit` );
};

const handleDelete = ( id: number ) => {
    router.delete( `/employer/jobs/${ id }`, { preserveScroll: true } );
};

const handleDuplicate = ( id: number ) => {
    router.post( `/employer/jobs/${ id }/duplicate`, { preserveScroll: true } );
}

export const columns: ColumnDef<Opening>[] = [
    {
        accessorFn: ( row, index ) => index + 1,
        header: 'S.No.',
        enableGlobalFilter: false,
    },
    {
        accessorKey: 'title',
        header: 'Job Title',
        enableGlobalFilter: true,
    },
    {
        accessorKey: 'employment_type',
        header: 'Employment Type',
    },
    {
        accessorKey: 'work_model',
        header: 'Work Model',
    },
    {
        accessorKey: 'status',
        header: 'Status',
    },
    {
        accessorKey: 'published_at',
        header: 'Published Date',
        cell: ( { row } ) => {
            const rawDate = row.getValue( 'published_at' );
            if ( !rawDate ) return <span>Not published</span>;
            const date = new Date( String( rawDate ) );
            if ( isNaN( date.getTime() ) ) return <span>Invalid date</span>;
            return format( date, 'dd MMM yyyy' );
        }
    },
    {
        id: 'actions',
        cell: ( { row } ) => {
            return <DataTableActions
                onEdit={ () => handleEdit( row.original.id ) }
                onDelete={ () => handleDelete( row.original.id ) }
                hasDuplicate={ true }
                onDuplicate={ () => handleDuplicate( row.original.id ) }
            />;
        },
    },
];
