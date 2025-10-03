import { Head, router, useForm } from "@inertiajs/react";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useForm as useHookForm } from "react-hook-form";
import * as z from "zod";
import { Download, User, X, Loader2, FileUp, Filter } from "lucide-react";

import JobApplicationCard from "@/components/job-application-card";
import MultipleSelector from "@/components/multiple-selector";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import AppLayout from "@/layouts/app-layout";
import { Application, BreadcrumbItem, Opening, Option } from "@/types";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

const formSchema = z.object({
	users: z
		.array(
			z.object({
				value: z.string(),
				label: z.string(),
			}),
		)
		.min(1, { message: "Please select at least one user." }),
});

const matchingScoreOptions = [
	{ value: "1-10", label: "1-10%" },
	{ value: "10-20", label: "10-20%" },
	{ value: "20-30", label: "20-30%" },
	{ value: "30-40", label: "30-40%" },
	{ value: "40-50", label: "40-50%" },
	{ value: "50-60", label: "50-60%" },
	{ value: "60-70", label: "60-70%" },
	{ value: "70-80", label: "70-80%" },
	{ value: "80-90", label: "80-90%" },
	{ value: "90-100", label: "90-100%" },
];

// Debounce hook for optimizing filter changes
const useDebounce = (value: any, delay: number) => {
	const [debouncedValue, setDebouncedValue] = useState(value);

	useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedValue(value);
		}, delay);

		return () => {
			clearTimeout(handler);
		};
	}, [value, delay]);

	return debouncedValue;
};

interface Props {
	applications: Application[];
	statuses: Option[];
	users: Option[];
	job: Opening;
	exportUrl?: string;
	filters: {
		status?: string;
		matching_score_range?: string;
	};
}

export default function JobApplications({
	applications,
	statuses,
	users,
	job,
	exportUrl,
	filters: initialFilters,
}: Props) {
	const [open, setOpen] = useState(false);
	const [isExporting, setIsExporting] = useState(false);
	const [activeFilters, setActiveFilters] = useState(initialFilters);
	const [isDownloadingResumes, setIsDownloadingResumes] = useState(false);
	const [selectedApplications, setSelectedApplications] = useState<number[]>(
		[],
	);
	const [error, setError] = useState<string | null>(null);

	// Inertia form for applying candidates
	const { data, setData, post, processing, errors, reset } = useForm({
		user_ids: [],
	});

	const hookForm = useHookForm<z.infer<typeof formSchema>>({
		defaultValues: { users: [] },
	});

	const breadcrumbs: BreadcrumbItem[] = useMemo(
		() => [
			{ title: "Jobs", href: "/admin/jobs" },
			{ title: job.title, href: "" },
		],
		[job.title],
	);

	const hasActiveFilters = useMemo(
		() =>
			Object.values(activeFilters).some(
				(value) => value !== undefined && value !== "",
			),
		[activeFilters],
	);

	const exportWithFilters = useMemo(() => {
		if (!exportUrl) return "";
		const params = new URLSearchParams();
		if (activeFilters.status) params.append("status", activeFilters.status);
		if (activeFilters.matching_score_range)
			params.append("matching_score_range", activeFilters.matching_score_range);
		return `${exportUrl}?${params.toString()}`;
	}, [exportUrl, activeFilters]);

	// Use debounced filters to reduce API calls
	const debouncedFilters = useDebounce(activeFilters, 500);

	useEffect(() => {
		setActiveFilters(initialFilters);
	}, [initialFilters]);

	useEffect(() => {
		// Apply filters when debounced values change
		if (JSON.stringify(debouncedFilters) !== JSON.stringify(initialFilters)) {
			router.get(
				`/admin/jobs/${job.id}/applications`,
				{ ...debouncedFilters },
				{ preserveState: true },
			);
		}
	}, [debouncedFilters, job.id, initialFilters]);

	const handleSelectApplication = useCallback(
		(id: number, selected: boolean) => {
			setSelectedApplications((prev) =>
				selected ? [...prev, id] : prev.filter((appId) => appId !== id),
			);
		},
		[],
	);

	const handleSelectAll = useCallback(
		(checked: boolean) => {
			setSelectedApplications(checked ? applications.map((app) => app.id) : []);
		},
		[applications],
	);

	const handleDownloadResumes = useCallback(() => {
		if (selectedApplications.length === 0 && applications.length > 0) {
			setSelectedApplications(applications.map((app) => app.id));
		}

		if (selectedApplications.length === 0) {
			setError("Please select at least one application to download");
			return;
		}

		setIsDownloadingResumes(true);
		setError(null);

		const params = new URLSearchParams();
		selectedApplications.forEach((id) =>
			params.append("application_ids[]", id),
		);
		if (activeFilters.status) params.append("status", activeFilters.status);
		if (activeFilters.matching_score_range)
			params.append("matching_score_range", activeFilters.matching_score_range);

		// Direct file download (not Inertia)
		const url = `/admin/jobs/${job.id}/applications/resumes/download-selected?${params.toString()}`;
		const link = document.createElement("a");
		link.href = url;
		link.download = "";
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);

		setTimeout(() => setIsDownloadingResumes(false), 3000);
	}, [selectedApplications, job.id, activeFilters, applications]);

	const onSubmit = useCallback(
		(values: z.infer<typeof formSchema>) => {
			// Extract just the user IDs for submission
			const userIds = values.users.map((user) => user.value);

			// Use Inertia's form helper to submit
			post(`/admin/jobs/${job.id}/applications`, {
				onSuccess: () => {
					setOpen(false);
					hookForm.reset();
				},
			});
		},
		[job.id, post, hookForm],
	);

	const handleExport = useCallback(() => {
		if (!exportWithFilters) return;

		setIsExporting(true);
		const link = document.createElement("a");
		link.href = exportWithFilters;
		link.download = `${job.title.replace(/\s+/g, "_")}_applications.xlsx`;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		setTimeout(() => setIsExporting(false), 3000);
	}, [exportWithFilters, job.title]);

	const handleFilterChange = useCallback(
		(key: string, value: string) => {
			const newFilters = { ...activeFilters, [key]: value };
			setActiveFilters(newFilters);
		},
		[activeFilters],
	);

	const clearFilters = useCallback(() => {
		setActiveFilters({});
	}, []);

	const statusBadgeContent = useMemo(() => {
		if (!activeFilters.status) return null;
		const statusLabel = statuses.find(
			(s) => s.value === activeFilters.status,
		)?.label;
		return (
			<Badge variant="secondary" className="gap-1 py-1">
				Status: {statusLabel}
				<X
					className="h-3 w-3 cursor-pointer"
					onClick={() => handleFilterChange("status", "")}
				/>
			</Badge>
		);
	}, [activeFilters.status, statuses, handleFilterChange]);

	const scoreBadgeContent = useMemo(() => {
		if (!activeFilters.matching_score_range) return null;
		const scoreLabel = matchingScoreOptions.find(
			(s) => s.value === activeFilters.matching_score_range,
		)?.label;
		return (
			<Badge variant="secondary" className="gap-1 py-1">
				Score: {scoreLabel}
				<X
					className="h-3 w-3 cursor-pointer"
					onClick={() => handleFilterChange("matching_score_range", "")}
				/>
			</Badge>
		);
	}, [activeFilters.matching_score_range, handleFilterChange]);

	return (
		<AppLayout breadcrumbs={breadcrumbs}>
			<Head title="Applications" />

			{/* Error Display */}
			{error && (
				<div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
					{error}
				</div>
			)}

			<div className="flex h-full flex-col gap-4 rounded-xl p-4">
				<div className="flex items-center justify-between">
					<h1 className="text-2xl font-semibold">
						Applications for {job.title}
					</h1>

					<div className="flex items-center gap-2">
						{exportUrl && (
							<Button
								variant="outline"
								onClick={handleExport}
								disabled={isExporting}
								className="flex items-center gap-2"
							>
								{isExporting ? (
									<>
										<Loader2 className="h-4 w-4 animate-spin" />
										<span>Exporting...</span>
									</>
								) : (
									<>
										<FileUp className="h-4 w-4" />
										<span>Export</span>
									</>
								)}
							</Button>
						)}

						<Dialog open={open} onOpenChange={setOpen}>
							<DialogTrigger asChild>
								<Button variant="default" className="ml-auto">
									Apply for Candidates
								</Button>
							</DialogTrigger>

							<DialogContent className="sm:max-w-[425px]">
								<Form {...hookForm}>
									<form onSubmit={hookForm.handleSubmit(onSubmit)}>
										<DialogHeader>
											<DialogTitle>Apply for Job</DialogTitle>
											<DialogDescription>
												Select candidates to apply for this position.
											</DialogDescription>
										</DialogHeader>

										<div className="grid gap-4 py-4">
											<FormField
												control={hookForm.control}
												name="users"
												render={({ field }) => (
													<FormItem>
														<FormLabel>Select Candidates</FormLabel>
														<FormControl>
															<MultipleSelector
																options={users}
																value={field.value}
																onChange={field.onChange}
																placeholder="Search candidates..."
																emptyIndicator={
																	<p className="w-full text-center text-sm text-muted-foreground">
																		No candidates found
																	</p>
																}
																hidePlaceholderWhenSelected
																creatable={false}
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
										</div>

										<DialogFooter>
											<DialogClose asChild>
												<Button
													variant="outline"
													type="button"
													disabled={processing}
												>
													Cancel
												</Button>
											</DialogClose>
											<Button type="submit" disabled={processing}>
												{processing ? "Applying..." : "Apply"}
											</Button>
										</DialogFooter>
									</form>
								</Form>
							</DialogContent>
						</Dialog>
					</div>
				</div>

				<div className="flex flex-col gap-4 rounded-lg border p-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<Filter className="h-4 w-4" />
							<h3 className="font-semibold">Filters</h3>
						</div>
						{hasActiveFilters && (
							<Button
								variant="ghost"
								onClick={clearFilters}
								className="h-8 px-2 lg:px-3"
							>
								Clear filters
								<X className="ml-2 h-4 w-4" />
							</Button>
						)}
					</div>

					<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
						<div className="space-y-2">
							<label className="text-sm font-medium">Status</label>
							<Select
								value={activeFilters.status || ""}
								onValueChange={(value) => handleFilterChange("status", value)}
							>
								<SelectTrigger>
									<SelectValue placeholder="All Statuses" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">All Statuses</SelectItem>
									{statuses.map((status) => (
										<SelectItem key={status.value} value={status.value}>
											{status.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<div className="space-y-2">
							<label className="text-sm font-medium">
								Matching Score Range
							</label>
							<Select
								value={activeFilters.matching_score_range || ""}
								onValueChange={(value) =>
									handleFilterChange("matching_score_range", value)
								}
							>
								<SelectTrigger>
									<SelectValue placeholder="Any Range" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">Any Range</SelectItem>
									{matchingScoreOptions.map((option) => (
										<SelectItem key={option.value} value={option.value}>
											{option.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>

					{hasActiveFilters && (
						<div className="flex flex-wrap gap-2 pt-2">
							{statusBadgeContent}
							{scoreBadgeContent}
						</div>
					)}
				</div>

				{applications.length > 0 ? (
					<>
						<div className="flex items-center justify-between mb-4">
							<div className="flex items-center space-x-2">
								<Checkbox
									id="select-all"
									checked={
										selectedApplications.length === applications.length &&
										applications.length > 0
									}
									onCheckedChange={handleSelectAll}
									className="h-5 w-5 rounded-md border-2 data-[state=checked]:bg-primary"
								/>
								<label
									htmlFor="select-all"
									className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
								>
									Select all ({selectedApplications.length} selected)
								</label>
							</div>

							<Button
								onClick={handleDownloadResumes}
								disabled={
									isDownloadingResumes ||
									(selectedApplications.length === 0 &&
										applications.length === 0)
								}
								className="flex items-center gap-2"
							>
								{isDownloadingResumes ? (
									<>
										<Loader2 className="h-4 w-4 animate-spin" />
										<span>Downloading...</span>
									</>
								) : (
									<>
										<Download className="h-4 w-4" />
										<span>
											{selectedApplications.length === applications.length &&
											applications.length > 0
												? "Download All Resumes"
												: `Download Selected (${selectedApplications.length})`}
										</span>
									</>
								)}
							</Button>
						</div>
						<div className="grid gap-4 lg:grid-cols-2">
							{applications.map((application) => (
								<JobApplicationCard
									key={application.id}
									application={application}
									statuses={statuses}
									message={false}
									selectable={true}
									selected={selectedApplications.includes(application.id)}
									onSelect={handleSelectApplication}
								/>
							))}
						</div>
					</>
				) : (
					<div className="flex h-full flex-col items-center justify-center space-y-4">
						<div className="rounded-full bg-muted p-4">
							<User className="h-12 w-12 text-muted-foreground" />
						</div>
						<div className="space-y-1 text-center">
							<h3 className="text-lg font-semibold">No applications yet</h3>
							<p className="text-sm text-muted-foreground">
								Applications will appear here once candidates apply for this
								position.
							</p>
						</div>
					</div>
				)}
			</div>
		</AppLayout>
	);
}
