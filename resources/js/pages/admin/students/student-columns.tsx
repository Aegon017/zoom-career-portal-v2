import DataTableActions from '@/components/data-table-actions';
import { Badge } from '@/components/ui/badge';
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
        accessorKey: 'email',
        header: 'Email',
        enableGlobalFilter: true,
    },
    {
        accessorKey: 'phone',
        header: 'Phone',
        enableGlobalFilter: true,
    },
    {
        accessorKey: 'profile_completed',
        header: 'Profile status',
        enableGlobalFilter: true,
        cell: ( { row } ) => {
            const value = row.original.profile_completed;

            let badgeText = 'Incomplete';
            let badgeClass = 'bg-gray-400';

            if ( value >= 80 ) {
                badgeText = 'Excellent';
                badgeClass = 'bg-green-500';
            } else if ( value >= 50 ) {
                badgeText = 'Partial';
                badgeClass = 'bg-yellow-500';
            } else if ( value > 0 ) {
                badgeText = 'Poor';
                badgeClass = 'bg-red-500';
            }

            return (
                <div className="flex flex-col gap-1 min-w-[120px]">
                    <div className="relative w-full h-2 rounded bg-muted">
                        <div
                            className={ `absolute left-0 top-0 h-2 rounded ${ badgeClass }` }
                            style={ { width: `${ value }%` } }
                        ></div>
                    </div>

                    <div className="flex items-center justify-between text-xs mt-1">
                        <span className="text-muted-foreground">{ value }%</span>
                        <Badge className={ `${ badgeClass } text-white` }>
                            { badgeText }
                        </Badge>
                    </div>
                </div>
            );
        },
    },
    {
        id: 'actions',
        cell: ( { row } ) => {
            return <DataTableActions hasShow={ true } onEdit={ () => handleEdit( row.original.id ) } onDelete={ () => handleDelete( row.original.id ) } onShow={ () => handleShow( row.original.id ) } />;
        },
    },
];
