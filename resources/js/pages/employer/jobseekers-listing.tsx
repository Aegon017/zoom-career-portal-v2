import JobseekerCard from "@/components/employer/jobseeker-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import AppLayout from "@/layouts/employer-layout";
import { BreadcrumbItem, Opening, User } from "@/types";
import { Head, Link, router } from "@inertiajs/react";
import { Search, X, User as UserIcon, Filter } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

interface UsersResponse {
	data: User[];
	total: number;
	next_page_url: string | null;
}

const breadcrumbs: BreadcrumbItem[] = [
	{ title: "Jobseekers", href: "/employer/jobseekers" },
];

interface Props {
	initialUsers: UsersResponse;
	jobs: Opening[];
}

const matchingScoreOptions = [
	{ value: "70-100", label: "70-100%" },
	{ value: "50-69", label: "50-69%" },
	{ value: "30-49", label: "30-49%" },
	{ value: "1-29", label: "1-29%" },
];

export default function JobseekersListing({ initialUsers, jobs }: Props) {
	const [users, setUsers] = useState<User[]>(initialUsers.data);
	const [total, setTotal] = useState(initialUsers.total);
	const [nextPageUrl, setNextPageUrl] = useState(initialUsers.next_page_url);
	const [loading, setLoading] = useState(false);
	const [search, setSearch] = useState("");
	const [selectedJobId, setSelectedJobId] = useState<string>("");
	const [matchingScoreFilter, setMatchingScoreFilter] = useState<string>("");

	const debounceRef = useRef<NodeJS.Timeout | null>(null);

	const clearFilters = () => {
		setSearch("");
		setMatchingScoreFilter("");
	};

	const hasFilters = search !== "" || matchingScoreFilter !== "";
	const hasSelectedJob = selectedJobId !== "";

	// Function to sort users by match_score in descending order
	const sortUsersByMatchScore = (users: User[]) => {
		return [...users].sort((a, b) => b.match_score - a.match_score);
	};

	const fetchFilteredUsers = useCallback(
		(query: { search?: string; job_id?: string; matching_score?: string }) => {
			if (!query.job_id) {
				// Don't fetch if no job is selected
				setUsers([]);
				setTotal(0);
				setNextPageUrl(null);
				return;
			}

			setLoading(true);
			router.get("/employer/jobseekers", query, {
				preserveState: true,
				replace: true,
				only: ["initialUsers"],
				onSuccess: (page) => {
					const data = page.props.initialUsers as UsersResponse;
					const sortedUsers = sortUsersByMatchScore(data.data); // Sort here
					setUsers(sortedUsers);
					setTotal(data.total);
					setNextPageUrl(data.next_page_url);
					setLoading(false);
				},
				onError: () => {
					setLoading(false);
				},
			});
		},
		[],
	);

	useEffect(() => {
		if (debounceRef.current) {
			clearTimeout(debounceRef.current);
		}

		debounceRef.current = setTimeout(() => {
			fetchFilteredUsers({
				search: search || undefined,
				job_id: selectedJobId || undefined,
				matching_score: matchingScoreFilter || undefined,
			});
		}, 500);

		return () => {
			if (debounceRef.current) {
				clearTimeout(debounceRef.current);
			}
		};
	}, [search, selectedJobId, matchingScoreFilter, fetchFilteredUsers]);

	const loadMore = useCallback(() => {
		if (!nextPageUrl || loading || !hasSelectedJob) return;

		setLoading(true);
		router.get(
			nextPageUrl,
			{ search, job_id: selectedJobId, matching_score: matchingScoreFilter },
			{
				preserveScroll: true,
				preserveState: true,
				only: ["initialUsers"],
				onSuccess: (page) => {
					const data = page.props.initialUsers as UsersResponse;
					const updatedUsers = [...users, ...data.data];

					// Sort users by match_score in descending order
					const sortedUsers = sortUsersByMatchScore(updatedUsers);

					setUsers(sortedUsers);
					setNextPageUrl(data.next_page_url);
					setLoading(false);
				},
				onError: () => {
					setLoading(false);
				},
			},
		);
	}, [
		nextPageUrl,
		loading,
		search,
		selectedJobId,
		matchingScoreFilter,
		users,
		hasSelectedJob,
	]);

	// Get selected job title for display
	const selectedJob = jobs.find(
		(job) => job.id === parseInt(selectedJobId),
	)?.title;

	return (
		<AppLayout breadcrumbs={breadcrumbs}>
			<Head title="Jobseekers" />
			<div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
				<Card className="mb-6 rounded-none border-0 border-b-2 p-0 shadow-none">
					<CardContent className="space-y-4 p-0 pb-4">
						<div className="grid grid-cols-12 gap-2">
							<div className="col-span-12 md:col-span-4">
								<Select
									value={selectedJobId}
									onValueChange={setSelectedJobId}
									disabled={loading}
								>
									<SelectTrigger>
										<SelectValue placeholder="Select a job" />
									</SelectTrigger>
									<SelectContent>
										{jobs.map((job) => (
											<SelectItem key={job.id} value={String(job.id)}>
												{job.title}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>

							{hasSelectedJob && (
								<>
									<div className="relative col-span-12 md:col-span-4">
										<Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
										<Input
											placeholder="Search candidates..."
											className="pl-10"
											value={search}
											onChange={(e) => setSearch(e.target.value)}
											disabled={loading}
										/>
										{search && (
											<button
												onClick={() => setSearch("")}
												className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
											>
												<X className="h-4 w-4" />
											</button>
										)}
									</div>

									<div className="col-span-12 md:col-span-4">
										<Select
											value={matchingScoreFilter}
											onValueChange={setMatchingScoreFilter}
											disabled={loading}
										>
											<SelectTrigger>
												<SelectValue placeholder="Filter by match score" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="all">All Match Scores</SelectItem>
												{matchingScoreOptions.map((option) => (
													<SelectItem key={option.value} value={option.value}>
														{option.label}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>
								</>
							)}

							{hasSelectedJob && hasFilters && (
								<div className="col-span-12 flex justify-end">
									<Button
										variant="ghost"
										onClick={clearFilters}
										disabled={loading}
										className="flex items-center gap-2"
									>
										<X className="h-4 w-4" />
										Clear filters
									</Button>
								</div>
							)}
						</div>
					</CardContent>
				</Card>

				{hasSelectedJob ? (
					<div className="mx-auto flex w-full flex-col md:w-2xl">
						{users.length > 0 && (
							<div className="mb-4 flex flex-col gap-2 sm:flex-row sm:justify-between">
								<span className="text-muted-foreground text-sm">
									Showing {users.length} of {total} candidates
								</span>
								{(search || matchingScoreFilter) && (
									<div className="flex flex-wrap items-center gap-2">
										{search && (
											<span className="bg-muted text-muted-foreground rounded-full px-3 py-1 text-xs">
												Search: "{search}"
											</span>
										)}
										{matchingScoreFilter && (
											<span className="bg-muted text-muted-foreground rounded-full px-3 py-1 text-xs">
												Match Score:{" "}
												{
													matchingScoreOptions.find(
														(opt) => opt.value === matchingScoreFilter,
													)?.label
												}
											</span>
										)}
									</div>
								)}
							</div>
						)}

						{users.length === 0 ? (
							<div className="text-muted-foreground py-12 text-center text-sm">
								{loading
									? "Searching..."
									: "No candidates found matching your criteria"}
							</div>
						) : (
							<div className="space-y-4">
								{users.map((user) => (
									<JobseekerCard key={user.id} user={user} />
								))}
							</div>
						)}

						{nextPageUrl && (
							<div className="mt-6 flex justify-center">
								<Button variant="outline" onClick={loadMore} disabled={loading}>
									{loading ? "Loading..." : "Load More"}
								</Button>
							</div>
						)}
					</div>
				) : (
					<div className="flex flex-1 flex-col items-center justify-center gap-4 py-8">
						<div className="rounded-full bg-muted p-4">
							<UserIcon className="h-12 w-12 text-muted-foreground" />
						</div>
						<div className="space-y-1 text-center">
							<h3 className="text-lg font-semibold">Select a job</h3>
							<p className="text-sm text-muted-foreground">
								Please select a job to view students and filter by match score.
							</p>
						</div>
					</div>
				)}
			</div>
		</AppLayout>
	);
}
