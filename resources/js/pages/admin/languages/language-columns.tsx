

import DataTableActions from '@/components/data-table-actions';
import { Language } from '@/types';
import { router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';

const handleEdit = (id: number) => {
    router.get(`/admin/languages/${id}/edit`);
};

const handleDelete = (id: number) => {
    router.delete(`/admin/languages/${id}`, { preserveScroll: true });
};

export const columns: ColumnDef<Language>[] = [
    {
        accessorFn: (row, index) => index + 1,
        header: 'S.No.',
        enableGlobalFilter: false,
    },
    {
        accessorKey: 'name',
        header: 'Name',
        enableGlobalFilter: true,
    },
    {
        accessorKey: 'code',
        header: 'code',
        enableGlobalFilter: true,
    },
    {
        id: 'actions',
        cell: ({ row }) => {
            return <DataTableActions onEdit={() => handleEdit(row.original.id)} onDelete={() => handleDelete(row.original.id)} />;
        },
    },
];
