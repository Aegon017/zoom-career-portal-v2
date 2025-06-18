"use client"

import DataTableActions from "@/components/data-table-actions";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Company } from "@/types";
import { Link, router } from "@inertiajs/react";
import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react";

const goToShow = (id: number) => {
    router.get(route('admin.companies.show', id));
}

export const columns: ColumnDef<Company>[] = [
    {
        accessorFn: (row, index) => index + 1,
        header: "S.No.",
    },
    {
        accessorKey: "company_name",
        header: "Name",
        enableGlobalFilter: true,
    },
    {
        id: "actions",
        cell: ({ row }) => {
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="cursor-pointer text-sm text-foreground hover:bg-muted transition-colors" onClick={() => goToShow(row.original.id)}>Show</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu >
            )
        }
    }
]