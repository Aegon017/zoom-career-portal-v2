import { useState, useMemo } from "react";
import { Head } from "@inertiajs/react"; // Removed unused router import
import { Download, User, Loader2 } from "lucide-react";

import JobApplicationCard from "@/components/job-application-card";
import { JobApplicationsFilter } from "@/components/job-applications-filter";
import AppLayout from "@/layouts/employer-layout";
import { Application, BreadcrumbItem, Opening, Option } from "@/types";
import { Button } from "@/components/ui/button";

const breadcrumbs: BreadcrumbItem[] = [
	{
		title: "Applications",
		href: "/employer/applications",
	},
];

interface Props {
	jobs: Opening[];
	job_id?: number;
	applications: Application[];
	statuses: Option[];
	skills: string[];
	exportUrl?: string;
}

export default function ApplicationsIndex({
	jobs,
	job_id,
	applications = [], // Default value for safety
	statuses,
	skills,
	exportUrl,
}: Props) {
	// Memoized derived values for performance
	const hasApplications = useMemo(
		() => applications.length > 0,
		[applications],
	);
	const hasSelectedJob = useMemo(() => Boolean(job_id), [job_id]);
	const [isExporting, setIsExporting] = useState(false);

	// Memoized job options to prevent unnecessary recalculations
	const jobOptions = useMemo(
		() =>
			jobs.map((job) => ({
				value: String(job.id),
				label: job.title,
			})),
		[jobs],
	);

	const handleExport = () => {
		if (!exportUrl) return;

		setIsExporting(true);
		try {
			// Improved download method using hidden anchor
			const anchor = document.createElement("a");
			anchor.href = exportUrl;
			anchor.download = "applications.xlsx";
			anchor.style.display = "none";
			document.body.appendChild(anchor);
			anchor.click();
			document.body.removeChild(anchor);
		} catch (error) {
			console.error("Export failed:", error);
		} finally {
			setIsExporting(false);
		}
	};

	return (
		<AppLayout breadcrumbs={breadcrumbs}>
			<Head title="Applications" />

			<div className="flex flex-1 flex-col gap-4 p-4 rounded-xl">
				<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
					<h1 className="text-2xl font-semibold">Candidate Applications</h1>

					<div className="flex items-center gap-2">
						{exportUrl && (
							<Button
								variant="outline"
								onClick={handleExport}
								disabled={isExporting}
								aria-busy={isExporting}
								className="flex items-center gap-2"
							>
								{isExporting ? (
									<>
										<Loader2 className="h-4 w-4 animate-spin" />
										<span>Exporting...</span>
									</>
								) : (
									<>
										<Download className="h-4 w-4" />
										<span>Export</span>
									</>
								)}
							</Button>
						)}

						<JobApplicationsFilter
							statuses={statuses}
							skills={skills}
							defaultValue={job_id ? job_id : undefined}
							jobOptions={jobOptions}
						/>
					</div>
				</div>

				{hasApplications ? (
					<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-2 lg:grid-cols-1">
						{applications.map((application) => (
							<JobApplicationCard
								key={application.id}
								application={application}
								statuses={statuses}
							/>
						))}
					</div>
				) : (
					<div className="flex flex-1 flex-col items-center justify-center gap-4 py-8">
						<div className="rounded-full bg-muted p-4">
							<User className="h-12 w-12 text-muted-foreground" />
						</div>
						<div className="space-y-1 text-center">
							<h3 className="text-lg font-semibold">
								{hasSelectedJob ? "No applications yet" : "Select a job"}
							</h3>
							<p className="text-sm text-muted-foreground">
								{hasSelectedJob
									? "Applications will appear here once candidates apply for this position."
									: "Please select a job to view its applications."}
							</p>
						</div>
					</div>
				)}
			</div>
		</AppLayout>
	);
}
