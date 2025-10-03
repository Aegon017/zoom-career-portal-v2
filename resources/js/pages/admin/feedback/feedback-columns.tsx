import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Feedback, User } from "@/types";
import { router } from "@inertiajs/react";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

const goToShow = (id: number) => {
	router.get(`/admin/feedback/${id}`);
};

export const columns: ColumnDef<Feedback>[] = [
	{
		accessorFn: (row, index) => index + 1,
		header: "S.No.",
		enableGlobalFilter: false,
	},
	{
		accessorKey: "user.name",
		header: "Name",
		enableGlobalFilter: true,
	},
	{
		accessorKey: "user.email",
		header: "Email",
		enableGlobalFilter: true,
	},
	{
		accessorKey: "opening.title",
		header: "Job Title",
		enableGlobalFilter: true,
	},
	{
		accessorKey: "feedback",
		header: "Experience",
		cell: ({ getValue }) => {
			const text = getValue<string>();
			return text.length > 60 ? text.slice(0, 60) + "..." : text;
		},
		enableGlobalFilter: true,
	},
	{
		accessorKey: "created_at",
		header: "Submitted On",
		cell: ({ getValue }) => new Date(getValue<string>()).toLocaleDateString(),
		enableGlobalFilter: false,
	},
	{
		id: "actions",
		cell: ({ row }) => (
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
					<DropdownMenuItem
						className="text-foreground hover:bg-muted cursor-pointer text-sm transition-colors"
						onClick={() => goToShow(row.original.id)}
					>
						Show
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		),
	},
];
