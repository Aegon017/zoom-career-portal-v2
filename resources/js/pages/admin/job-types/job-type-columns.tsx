"use client"

import DataTableActions from "@/components/data-table-actions";
import { JobType } from "@/types";
import { router } from "@inertiajs/react";
import { ColumnDef } from "@tanstack/react-table"

const handleEdit = (id: number) => {
    router.get(route("admin.job-types.edit", id));
};

const handleDelete = (id: number) => {
    router.delete(route("admin.job-types.destroy", id), { preserveScroll: true });
};

export const columns: ColumnDef<JobType>[] = [
    {
        accessorFn: (row, index) => index + 1,
        header: "S.No.",
        enableGlobalFilter: false,
    },
    {
        accessorKey: "name",
        header: "Name",
        enableGlobalFilter: true,
    },
    {
        id: "actions",
        cell: ({ row }) => {
            return (
                <DataTableActions
                    onEdit={() => handleEdit(row.original.id)}
                    onDelete={() => handleDelete(row.original.id)}
                />
            )

        }
    }
]
