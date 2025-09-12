import { Badge } from "@/components/ui/badge";
import { User } from "@/types";
import { router } from "@inertiajs/react";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<User>[] = [
	{
		accessorFn: (row, index) => index + 1,
		header: "S.No.",
	},
	{
		accessorKey: "name",
		header: "Name",
		enableGlobalFilter: true,
	},
	{
		accessorKey: "email",
		header: "Email",
		enableGlobalFilter: true,
	},
	{
		accessorKey: "total_applied",
		header: "Jobs Applied",
		cell: ({ row }) => row.original.total_applied ?? 0,
	},
	{
		accessorKey: "total_shortlisted",
		header: "Shortlisted",
		cell: ({ row }) => row.original.total_shortlisted ?? 0,
	},
	{
		accessorKey: "total_hired",
		header: "Hired",
		cell: ({ row }) => row.original.total_hired ?? 0,
	},
];
