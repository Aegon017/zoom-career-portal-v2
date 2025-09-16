import { Badge } from "@/components/ui/badge";
import { Opening, User } from "@/types";
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

export const columns: ColumnDef<Opening>[] = [
	{
		accessorFn: ( _, index ) => index + 1,
		header: "S.No.",
	},
	{
		accessorKey: "title",
		header: "Title",
		enableGlobalFilter: true,
		enableSorting: true,
		cell: ( { row } ) => {
			const opening = row.original;

			return (
				<Dialog>
					<DialogTrigger asChild>
						<Button variant="link" className="p-0 h-auto font-medium">
							{ opening.title }
						</Button>
					</DialogTrigger>
					<DialogContent className="max-w-4xl max-h-[80vh] bg-background flex flex-col">
						<DialogHeader>
							<DialogTitle>Applications for { opening.title }</DialogTitle>
							<DialogDescription>
								List of all students who applied for this position
							</DialogDescription>
						</DialogHeader>
						<div className="mt-4 overflow-y-auto flex-1">
							<Table className="min-w-full">
								<TableHeader>
									<TableRow>
										<TableHead>Student Name</TableHead>
										<TableHead>Email</TableHead>
										<TableHead>Contact</TableHead>
										<TableHead>Status</TableHead>
										<TableHead>Applied Date</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{ opening.applications?.length ? (
										opening.applications.map( ( application ) => (
											<TableRow key={ application.id }>
												<TableCell className="font-medium">
													{ application.user.name }
												</TableCell>
												<TableCell>{ application.user.email }</TableCell>
												<TableCell>{ application.user.phone }</TableCell>
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
											<TableCell colSpan={ 5 } className="h-24 text-center">
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
		accessorFn: ( row ) => row.company?.name ?? "",
		header: "Company",
		enableGlobalFilter: true,
	},
	{
		accessorKey: "total_applied",
		header: "Students Applied",
		cell: ( { row } ) => row.original.total_applied ?? 0,
		enableSorting: true
	},
	{
		accessorKey: "total_shortlisted",
		header: "Shortlisted",
		cell: ( { row } ) => row.original.total_shortlisted ?? 0,
		enableSorting: true
	},
	{
		accessorKey: "total_hired",
		header: "Hired",
		cell: ( { row } ) => row.original.total_hired ?? 0,
		enableSorting: true
	},
];