"use client"

import DataTableActions from "@/components/data-table-actions";
import { Skill } from "@/types";
import { router } from "@inertiajs/react";
import { ColumnDef } from "@tanstack/react-table"

const handleEdit = (id: number) => {
    router.get(route("admin.skills.edit", id));
};

const handleDelete = (id: number) => {
    router.delete(route("admin.skills.destroy", id), { preserveScroll: true });
};

export const columns: ColumnDef<Skill>[] = [
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
