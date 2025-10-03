import DataTableActions from "@/components/data-table-actions";
import { Company } from "@/types";
import { router } from "@inertiajs/react";
import { ColumnDef } from "@tanstack/react-table";

const handleShow = (id: number) => {
	router.get(`/admin/companies/${id}`);
};

const handleEdit = (id: number) => {
	router.get(`/admin/companies/${id}/edit`);
};

const handleDelete = (id: number) => {
	router.delete(`/admin/companies/${id}`);
};

export const columns: ColumnDef<Company>[] = [
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
					hasShow={true}
					onShow={() => handleShow(row.original.id)}
					onEdit={() => handleEdit(row.original.id)}
					onDelete={() => handleDelete(row.original.id)}
				/>
			);
		},
	},
];
