import { useDebounce } from "@/hooks/use-debounce";
import { Link, router } from "@inertiajs/react";
import {
	ColumnDef,
	flexRender,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";
import {
	ChevronLeft,
	ChevronRight,
	ChevronsLeft,
	ChevronsRight,
	Download,
	Upload,
	FileText,
	FileDown,
	CheckSquare,
	Square,
	FileUp,
} from "lucide-react";
import {
	ChangeEvent,
	useEffect,
	useRef,
	useState,
	useCallback,
	useMemo,
} from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "./ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "./ui/table";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
	DialogTrigger,
} from "./ui/dialog";
import useSWR from "swr";
import { toast } from "sonner";
import useSWRMutation from "swr/mutation";
import axios from "axios";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	listingName: string;
	createUrl?: string;
	hasCreate?: boolean;
	hasExport?: boolean;
	hasImport?: boolean;
	importUrl?: string;
	exportUrl?: string;
	templateUrl?: string;
	pagination: {
		current_page: number;
		last_page: number;
		per_page: number;
		total: number;
	};
	filters: {
		search?: string;
		perPage?: number;
	};
	routeName: string;
	importColumns?: string[];
	exportFields?: {
		key: string;
		label: string;
		selected: boolean;
	}[];
}

interface TemplateResponse {
	headers: string[];
	required: string[];
	sample: Record<string, unknown>[];
}

const fetcher = (url: string) => axios.get(url).then((res) => res.data);
const uploadFile = async (url: string, { arg }: { arg: FormData }) => {
	const response = await axios.post(url, arg, {
		headers: { "Content-Type": "multipart/form-data" },
	});
	return response.data;
};

export function DataTable<TData, TValue>({
	columns,
	data,
	listingName,
	createUrl,
	hasCreate = true,
	pagination,
	filters,
	routeName,
	hasExport,
	exportUrl,
	hasImport,
	importUrl,
	templateUrl,
	importColumns,
	exportFields = [],
}: DataTableProps<TData, TValue>) {
	const [globalFilter, setGlobalFilter] = useState(filters.search ?? "");
	const [importDialogOpen, setImportDialogOpen] = useState(false);
	const [exportDialogOpen, setExportDialogOpen] = useState(false);
	const [selectedExportFields, setSelectedExportFields] = useState<
		{ key: string; label: string; selected: boolean }[]
	>([]);
	const debouncedSearch = useDebounce(globalFilter, 1000);
	const requestId = useRef(0);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const checkboxRef = useRef<HTMLButtonElement>(null);

	// Initialize export fields
	useEffect(() => {
		if (exportFields.length > 0) {
			setSelectedExportFields(exportFields);
		}
	}, [exportFields]);

	const { data: templateData, isLoading: templateLoading } =
		useSWR<TemplateResponse>(
			importDialogOpen && templateUrl ? templateUrl : null,
			fetcher,
			{ revalidateOnFocus: false },
		);

	const { trigger: importTrigger, isMutating: isImporting } = useSWRMutation(
		importUrl || "",
		uploadFile,
		{
			onSuccess: () => {
				setImportDialogOpen(false);
				router.reload({ only: ["data", "pagination", "filters"] });
				toast.success("File imported successfully");
			},
			onError: () => toast.error("Failed to import file"),
		},
	);

	useEffect(() => {
		const currentRequestId = ++requestId.current;
		router.get(
			routeName,
			{
				search: debouncedSearch,
				page: 1,
				perPage: pagination.per_page,
			},
			{
				preserveState: true,
				replace: true,
				onSuccess: () => {
					if (currentRequestId !== requestId.current) return;
				},
			},
		);
	}, [debouncedSearch, pagination.per_page, routeName]);

	const handlePageChange = useCallback(
		(page: number) => {
			router.get(
				routeName,
				{
					search: globalFilter,
					page,
					perPage: pagination.per_page,
				},
				{
					preserveState: true,
					preserveScroll: true,
					replace: true,
				},
			);
		},
		[globalFilter, pagination.per_page, routeName],
	);

	const handlePerPageChange = useCallback(
		(perPage: number) => {
			router.get(
				routeName,
				{
					search: globalFilter,
					page: 1,
					perPage,
				},
				{
					preserveState: true,
					replace: true,
				},
			);
		},
		[globalFilter, routeName],
	);

	const handleImport = useCallback(
		async (e: ChangeEvent<HTMLInputElement>) => {
			if (!e.target.files?.[0]) return;

			const formData = new FormData();
			formData.append("file", e.target.files[0]);
			await importTrigger(formData);
			if (fileInputRef.current) fileInputRef.current.value = "";
		},
		[importTrigger],
	);

	const handleExportFieldToggle = (key: string) => {
		setSelectedExportFields((prev) =>
			prev.map((field) =>
				field.key === key ? { ...field, selected: !field.selected } : field,
			),
		);
	};

	const selectAllExportFields = (select: boolean) => {
		setSelectedExportFields((prev) =>
			prev.map((field) => ({ ...field, selected: select })),
		);
	};

	const handleExport = () => {
		const selectedFields = selectedExportFields
			.filter((field) => field.selected)
			.map((field) => field.key);

		if (selectedFields.length === 0) {
			toast.error("Please select at least one field to export");
			return;
		}

		const exportWithFieldsUrl = `${exportUrl}?fields=${selectedFields.join(",")}`;
		window.open(exportWithFieldsUrl, "_blank");
		setExportDialogOpen(false);
		toast.success("Export started successfully");
	};

	const table = useReactTable({
		data,
		columns,
		state: { globalFilter },
		getCoreRowModel: getCoreRowModel(),
		manualPagination: true,
		pageCount: pagination.last_page,
	});

	const { start, end, total } = useMemo(
		() => ({
			start: (pagination.current_page - 1) * pagination.per_page + 1,
			end: Math.min(
				pagination.current_page * pagination.per_page,
				pagination.total,
			),
			total: pagination.total.toLocaleString(),
		}),
		[pagination],
	);

	const allFieldsSelected =
		selectedExportFields.length > 0 &&
		selectedExportFields.every((field) => field.selected);
	const someFieldsSelected =
		selectedExportFields.some((field) => field.selected) && !allFieldsSelected;

	return (
		<div className="space-y-4">
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<p className="text-sm text-muted-foreground">
					Showing <span className="font-medium">{start}</span> to{" "}
					<span className="font-medium">{end}</span> of{" "}
					<span className="font-medium">{total}</span> results
				</p>

				<div className="flex flex-col gap-2 sm:flex-row sm:items-center">
					<div className="flex gap-2">
						<Input
							placeholder="Search..."
							value={globalFilter}
							onChange={(e) => setGlobalFilter(e.target.value)}
							className="max-w-sm"
						/>
						{hasExport && exportUrl && (
							<Dialog
								open={exportDialogOpen}
								onOpenChange={setExportDialogOpen}
							>
								<DialogTrigger asChild>
									<Button variant="outline" size="sm">
										<FileUp className="w-4 h-4" />
										Export
									</Button>
								</DialogTrigger>
								<DialogContent className="sm:max-w-md">
									<DialogHeader>
										<DialogTitle>Export {listingName}</DialogTitle>
										<DialogDescription>
											Select the fields you want to include in the export file
										</DialogDescription>
									</DialogHeader>

									<div className="grid gap-4 py-4">
										<div className="flex items-center space-x-2">
											<Checkbox
												id="selectAll"
												checked={allFieldsSelected}
												onCheckedChange={() =>
													selectAllExportFields(!allFieldsSelected)
												}
												ref={checkboxRef}
											/>
											<Label
												htmlFor="selectAll"
												className="text-sm font-medium cursor-pointer"
											>
												{allFieldsSelected ? "Deselect All" : "Select All"}{" "}
												Fields
											</Label>
										</div>

										<div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto p-2 border rounded-md">
											{selectedExportFields.map((field) => (
												<div
													key={field.key}
													className="flex items-center space-x-2"
												>
													<Checkbox
														id={field.key}
														checked={field.selected}
														onCheckedChange={() =>
															handleExportFieldToggle(field.key)
														}
													/>
													<Label
														htmlFor={field.key}
														className="text-sm cursor-pointer"
													>
														{field.label}
													</Label>
												</div>
											))}
										</div>
									</div>

									<DialogFooter>
										<Button
											variant="outline"
											onClick={() => setExportDialogOpen(false)}
										>
											Cancel
										</Button>
										<Button onClick={handleExport}>
											<Download className="w-4 h-4 mr-2" />
											Export Selected Fields
										</Button>
									</DialogFooter>
								</DialogContent>
							</Dialog>
						)}
						{hasImport && importUrl && (
							<Dialog
								open={importDialogOpen}
								onOpenChange={setImportDialogOpen}
							>
								<DialogTrigger asChild>
									<Button variant="outline" size="sm">
										<FileDown className="w-4 h-4" />
										Import
									</Button>
								</DialogTrigger>
								<DialogContent className="sm:max-w-md">
									<DialogHeader>
										<DialogTitle>Import {listingName}</DialogTitle>
										<DialogDescription>
											Upload an Excel file with the correct format
										</DialogDescription>
									</DialogHeader>

									<div className="grid gap-4 py-4">
										<div className="space-y-2">
											<h4 className="font-medium text-sm">
												Template Requirements
											</h4>
											{templateLoading ? (
												<div className="text-sm text-muted-foreground">
													Loading template info...
												</div>
											) : (
												<div className="rounded-md border divide-y text-sm">
													<div className="p-2 flex items-center justify-between">
														<span className="font-medium">
															Required Columns
														</span>
														<span className="text-muted-foreground">
															{importColumns?.length} fields
														</span>
													</div>
													<div className="p-2 max-h-40 overflow-y-auto">
														<ul className="space-y-1">
															{importColumns?.map((header, index) => (
																<li key={index} className="flex items-center">
																	<FileText className="w-3 h-3 mr-2 text-muted-foreground" />
																	<span
																		className={
																			templateData?.required?.includes(header)
																				? "font-medium"
																				: ""
																		}
																	>
																		{header}
																		{templateData?.required?.includes(
																			header,
																		) && (
																			<span className="text-destructive ml-1">
																				*
																			</span>
																		)}
																	</span>
																</li>
															))}
														</ul>
													</div>
												</div>
											)}
										</div>

										<Button
											onClick={() => fileInputRef.current?.click()}
											disabled={isImporting}
											className="w-full"
										>
											<Upload className="w-4 h-4 mr-2" />
											{isImporting ? "Importing..." : "Select Excel File"}
										</Button>
										<input
											ref={fileInputRef}
											type="file"
											accept=".xlsx,.xls"
											onChange={handleImport}
											className="hidden"
											disabled={isImporting}
										/>
									</div>
								</DialogContent>
							</Dialog>
						)}
					</div>

					{hasCreate && createUrl && (
						<Link href={createUrl}>
							<Button className="w-full sm:w-auto">New {listingName}</Button>
						</Link>
					)}
				</div>
			</div>

			<div className="rounded-md border">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => (
									<TableHead key={header.id}>
										{flexRender(
											header.column.columnDef.header,
											header.getContext(),
										)}
									</TableHead>
								))}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && "selected"}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext(),
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="h-24 text-center"
								>
									No results found
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>

			<div className="flex flex-col items-center gap-4 px-2 sm:flex-row sm:justify-between">
				<div className="flex items-center space-x-2">
					<p className="text-sm font-medium">Rows per page</p>
					<Select
						value={String(pagination.per_page)}
						onValueChange={(value) => handlePerPageChange(Number(value))}
					>
						<SelectTrigger className="h-8 w-[70px]">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{[10, 20, 30, 50].map((size) => (
								<SelectItem key={size} value={String(size)}>
									{size}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				<div className="flex items-center gap-1">
					<Button
						variant="outline"
						size="icon"
						onClick={() => handlePageChange(1)}
						disabled={pagination.current_page === 1}
					>
						<ChevronsLeft className="h-4 w-4" />
					</Button>
					<Button
						variant="outline"
						size="icon"
						onClick={() => handlePageChange(pagination.current_page - 1)}
						disabled={pagination.current_page === 1}
					>
						<ChevronLeft className="h-4 w-4" />
					</Button>
					<span className="px-4 text-sm">
						Page {pagination.current_page} of {pagination.last_page}
					</span>
					<Button
						variant="outline"
						size="icon"
						onClick={() => handlePageChange(pagination.current_page + 1)}
						disabled={pagination.current_page === pagination.last_page}
					>
						<ChevronRight className="h-4 w-4" />
					</Button>
					<Button
						variant="outline"
						size="icon"
						onClick={() => handlePageChange(pagination.last_page)}
						disabled={pagination.current_page === pagination.last_page}
					>
						<ChevronsRight className="h-4 w-4" />
					</Button>
				</div>
			</div>
		</div>
	);
}
