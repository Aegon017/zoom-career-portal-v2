import OpeningItem from "@/components/jobseeker/opening-item";
import AppLayout from "@/layouts/jobseeker-layout";
import { Opening, SavedJob } from "@/types";
import { Head, router } from "@inertiajs/react";
import { useCallback, useState } from "react";

interface Props {
	initialSavedJobs: {
		data: SavedJob[];
		next_page_url: string;
	};
}

const SavedJobsListing = ({ initialSavedJobs }: Props) => {
	const [savedJobs, setSavedJobs] = useState(initialSavedJobs.data);
	const [nextPageUrl, setNextPageUrl] = useState<string | null>(
		initialSavedJobs.next_page_url,
	);
	const [loading, setLoading] = useState(false);
	const loadMore = useCallback(() => {
		if (!nextPageUrl || loading) return;
		setLoading(true);
		router.get(
			nextPageUrl,
			{},
			{
				preserveScroll: true,
				preserveState: true,
				only: ["companies"],
				onSuccess: (page) => {
					const companies = page.props.companies as {
						data: Opening[];
						next_page_url: string | null;
					};
					setSavedJobs((prev: SavedJob[]) => [
						...prev,
						...companies.data.map((opening) => ({
							id: opening.id,
							opening,
							opening_id: opening.id,
							user_id: opening.user_id ?? 0,
							created_at: opening.created_at ?? "",
							updated_at: opening.updated_at ?? "",
						})),
					]);
					setNextPageUrl(companies.next_page_url);
					setLoading(false);
				},
			},
		);
	}, [nextPageUrl, loading]);

	return (
		<AppLayout>
			<Head title="Explore" />
			<div className="zc-container">
				<div className="page-title px-4">
					<h2 className="mt-0">Saved Jobs</h2>
				</div>
				<div className="zc-saved-savedJobs-wrapper zc-card">
					<div className="zc-job-list">
						{savedJobs.length === 0 ? (
							<div className="py-8 text-center text-gray-500">
								You have no saved savedJobs yet.
							</div>
						) : (
							<>
								{savedJobs.map((savedJob: SavedJob) => (
									<OpeningItem key={savedJob.id} opening={savedJob.opening} />
								))}
							</>
						)}
					</div>
				</div>
			</div>
		</AppLayout>
	);
};

export default SavedJobsListing;
