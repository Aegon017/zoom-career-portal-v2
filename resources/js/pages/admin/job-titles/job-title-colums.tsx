import DataTableActions from "@/components/data-table-actions";
import { OpeningTItle } from "@/types";
import { router } from "@inertiajs/react";
import { ColumnDef } from "@tanstack/react-table";

const handleEdit = (id: number) => {
	router.get(`/admin/job-titles/${id}/edit`);
};

const handleDelete = (id: number) => {
	router.delete(`/admin/job-titles/${id}`, { preserveScroll: true });
};

export const columns: ColumnDef<OpeningTItle>[] = [
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
			);
		},
	},
];
