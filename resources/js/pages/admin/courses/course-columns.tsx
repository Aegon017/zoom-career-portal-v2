import DataTableActions from "@/components/data-table-actions";
import { Company, Course } from "@/types";
import { router } from "@inertiajs/react";
import { ColumnDef } from "@tanstack/react-table";

const handleEdit = (id: number) => {
	router.get(`/admin/courses/${id}/edit`);
};

const handleDelete = (id: number) => {
	router.delete(`/admin/courses/${id}`);
};

export const columns: ColumnDef<Course>[] = [
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
