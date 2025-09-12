import { Opening } from "@/types";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<Opening>[] = [
    {
        accessorFn: ( row, index ) => index + 1,
        header: "S.No.",
    },
    {
        accessorKey: "title",
        header: "Title",
        enableGlobalFilter: true,
    },
    {
        accessorKey: "total_applied",
        header: "Students Applied",
        cell: ( { row } ) => row.original.total_applied ?? 0,
    },
    {
        accessorKey: "total_shortlisted",
        header: "Shortlisted",
        cell: ( { row } ) => row.original.total_shortlisted ?? 0,
    },
    {
        accessorKey: "total_hired",
        header: "Hired",
        cell: ( { row } ) => row.original.total_hired ?? 0,
    },
];
