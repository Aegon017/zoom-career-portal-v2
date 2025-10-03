import DataTableActions from "@/components/data-table-actions";
import { Location } from "@/types";
import { router } from "@inertiajs/react";
import { ColumnDef } from "@tanstack/react-table";

const handleEdit = (id: number) => {
	router.get(`/admin/locations/${id}/edit`);
};

const handleDelete = (id: number) => {
	router.delete(`/admin/locations/${id}`, { preserveScroll: true });
};

export const columns: ColumnDef<Location>[] = [
	{
		accessorFn: (row, index) => index + 1,
		header: "S.No.",
		enableGlobalFilter: false,
	},
	{
		accessorKey: "city",
		header: "City",
		enableGlobalFilter: true,
	},
	{
		accessorKey: "state",
		header: "State",
		enableGlobalFilter: true,
	},
	{
		accessorKey: "country",
		header: "Country",
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
			);
		},
	},
];
