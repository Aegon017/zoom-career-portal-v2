import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Opening } from "@/types";
import { Link } from "@inertiajs/react";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { MoreHorizontal } from "lucide-react";

export const columns: ColumnDef<Opening>[] = [
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
		accessorFn: (row) => row.company?.name ?? "N/A",
		header: "Company",
		enableGlobalFilter: false,
	},
	{
		accessorFn: (row) => row.user?.name ?? "N/A",
		header: "Recruiter",
		enableGlobalFilter: false,
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
		},
	},
	{
		id: "actions",
		cell: ({ row }) => {
			const job = row.original;

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
						<DropdownMenuItem>
							<Link href={`/admin/jobs/${job.id}`} className="flex-1">
								Show
							</Link>
						</DropdownMenuItem>
						<DropdownMenuItem>
							<Link href={`/admin/jobs/${job.id}/applications`}>
								Applications
							</Link>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	},
];
