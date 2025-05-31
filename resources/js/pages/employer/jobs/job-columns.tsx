"use client"

import DataTableActions from "@/components/data-table-actions";
import { JobPosting } from "@/types"
import { router } from "@inertiajs/react";
import { ColumnDef } from "@tanstack/react-table"

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
        accessorKey: "salary_min",
        header: "Salary Min",
    },
    {
        accessorKey: "salary_max",
        header: "Salary Max",
    },
    {
        accessorKey: "salary_unit",
        header: "Salary Unit",
    },
    {
        accessorKey: "currency",
        header: "Currency",
    },
    {
        accessorKey: "city",
        header: "City",
    },
    {
        accessorKey: "state",
        header: "State",
    },
    {
        accessorKey: "country",
        header: "Country",
    },
    {
        accessorKey: "published_at",
        header: "Published",
    },
    {
        accessorKey: "expires_at",
        header: "Expires",
    },
    {
        accessorKey: "status",
        header: "Status",
    },
    {
        accessorKey: "verification_status",
        header: "Verification status",
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
