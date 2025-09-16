import { Badge } from "@/components/ui/badge";
import { User } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

export const columns: ColumnDef<User>[] = [
	{
		accessorFn: ( _, index ) => index + 1,
		header: "S.No.",
	},
	{
		accessorKey: "name",
		header: "Name",
		enableGlobalFilter: true,
		enableSorting: true,
		cell: ( { row } ) => {
			const student = row.original;
			return (
				<Dialog>
					<DialogTrigger asChild>
						<Button variant="link" className="p-0 h-auto font-medium">
							{ student.name }
						</Button>
					</DialogTrigger>
					<DialogContent className="max-w-4xl max-h-[80vh] bg-background flex flex-col">
						<DialogHeader>
							<DialogTitle>{ student.name }'s Job Applications</DialogTitle>
							<DialogDescription>
								List of all job applications submitted by { student.name }
							</DialogDescription>
						</DialogHeader>
						<div className="mt-4 overflow-y-auto flex-1">
							<Table className="min-w-full">
								<TableHeader>
									<TableRow>
										<TableHead>Company</TableHead>
										<TableHead>Job Title</TableHead>
										<TableHead>Status</TableHead>
										<TableHead>Applied Date</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{ student.opening_applications?.length ? (
										student.opening_applications.map( ( application ) => (
											<TableRow key={ application.id }>
												<TableCell>{ application.opening.company.name }</TableCell>
												<TableCell>{ application.opening.title }</TableCell>
												<TableCell>
													<Badge
														variant={
															application.status === "hired"
																? "default"
																: application.status === "shortlisted"
																	? "secondary"
																	: "outline"
														}
													>
														{ application.status }
													</Badge>
												</TableCell>
												<TableCell>
													{ new Date( application.created_at ).toLocaleDateString() }
												</TableCell>
											</TableRow>
										) )
									) : (
										<TableRow>
											<TableCell colSpan={ 4 } className="h-24 text-center">
												No applications found
											</TableCell>
										</TableRow>
									) }
								</TableBody>
							</Table>
						</div>
					</DialogContent>
				</Dialog>
			);
		},
	},
	{
		accessorKey: "email",
		header: "Email",
		enableGlobalFilter: true,
		enableSorting: true,
	},
	{
		accessorKey: "phone",
		header: "Phone",
		enableGlobalFilter: true,
	},
	{
		accessorKey: "total_applied",
		header: "Jobs Applied",
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