"use client"

import DataTableActions from "@/components/data-table-actions";
import { JobPosting } from "@/types"
import { router } from "@inertiajs/react";
import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns";

const handleEdit = (id: number) => {
    router.get(route("job-postings.edit", id));
};

const handleDelete = (id: number) => {
    router.delete(route("job-postings.destroy", id), { preserveScroll: true });
};

export const columns: ColumnDef<JobPosting>[] = [
    {
        accessorFn: (row, index) => index + 1,
        header: "S.No.",
        enableGlobalFilter: false,
    },
    {
        accessorKey: "title",
        header: "Job Title",
        enableGlobalFilter: true,
    },
    {
        accessorKey: "employment_type",
        header: "Employment Type",
    },
    {
        accessorKey: "work_model",
        header: "Work Model",
    },
    {
        accessorKey: "status",
        header: "Status",
    },
    {
        accessorKey: "verification_status",
        header: "Verification status",
    },
    {
        accessorKey: "published_at",
        header: "Published at",
        cell: ({ row }) => {
            return format(new Date(row.getValue("published_at")), "dd MMM yyyy");
        }
    }, {
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
