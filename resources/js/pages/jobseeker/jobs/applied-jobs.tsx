import { Head, router } from "@inertiajs/react";
import { useCallback, useState, useRef, useEffect } from "react";
import AppliedJobItem from "@/components/jobseeker/applied-opening-item";
import AppLayout from "@/layouts/jobseeker-layout";

interface Props {
	initialJobs: any[];
	pagination: {
		current_page: number;
		last_page: number;
		per_page: number;
		total: number;
	};
	applicationStatusOptions: { value: string; label: string }[];
}

const AppliedJobsListing = ({
	initialJobs,
	pagination,
	applicationStatusOptions,
}: Props) => {
	const [filters, setFilters] = useState({
		search: "",
		status: "",
		after_date: "",
		before_date: "",
	});
	const [isDateAccordionOpen, setIsDateAccordionOpen] = useState(true);
	const [isStatusAccordionOpen, setIsStatusAccordionOpen] = useState(true);
	const [loading, setLoading] = useState(false);
	const filtersRef = useRef(filters);

	useEffect(() => {
		filtersRef.current = filters;
	}, [filters]);

	const handleFilterChange = useCallback(
		(newFilters: Partial<typeof filters>) => {
			setFilters((prev) => {
				const updated = { ...prev, ...newFilters };
				setLoading(true);
				router.get("/jobseeker/jobs/your/applied/", updated, {
					preserveState: true,
					preserveScroll: true,
					replace: true,
					onFinish: () => setLoading(false),
				});
				return updated;
			});
		},
		[],
	);

	const handlePageChange = useCallback((page: number) => {
		setLoading(true);
		router.get(
			"/jobseeker/jobs/your/applied/",
			{ ...filtersRef.current, page },
			{
				preserveState: true,
				preserveScroll: true,
				onFinish: () => setLoading(false),
			},
		);
	}, []);

	return (
		<AppLayout>
			<Head title="Jobs Applied" />
			<div className="zc-container">
				<div className="page-title px-4">
					<h2>Jobs Applied</h2>
				</div>
			</div>
			<div className="zc-main-jobs-wrapper">
				<div className="zc-container">
					<div className="row">
						<div className="col-lg-4">
							<div className="zc-filter-wrapper">
								<div className="filter-header">
									<svg
										width="25px"
										height="25px"
										viewBox="0 0 24 24"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											d="M4 5L10 5M10 5C10 6.10457 10.8954 7 12 7C13.1046 7 14 6.10457 14 5M10 5C10 3.89543 10.8954 3 12 3C13.1046 3 14 3.89543 14 5M14 5L20 5M4 12H16M16 12C16 13.1046 16.8954 14 18 14C19.1046 14 20 13.1046 20 12C20 10.8954 19.1046 10 18 10C16.8954 10 16 10.8954 16 12ZM8 19H20M8 19C8 17.8954 7.10457 17 6 17C4.89543 17 4 17.8954 4 19C4 20.1046 4.89543 21 6 21C7.10457 21 8 20.1046 8 19Z"
											stroke="#000000"
											strokeWidth="1.5"
											strokeLinecap="round"
										/>
									</svg>
									<span className="text">Filters</span>
								</div>
								<div className="filter-content">
									<div className="zc-filter-accordion">
										<div className="zc-accordion-item">
											<div
												className={`zc-accordion-header ${isStatusAccordionOpen ? "active" : ""}`}
												onClick={() =>
													setIsStatusAccordionOpen(!isStatusAccordionOpen)
												}
											>
												<h3>Status</h3>
												<i className="fa-solid fa-angle-down"></i>
											</div>
											<div
												className="zc-accordion-content"
												style={{
													display: isStatusAccordionOpen ? "block" : "none",
												}}
											>
												<div className="jappli-status-filter">
													{applicationStatusOptions.map((option) => (
														<div
															className="zc-field check-box-field"
															key={option.value}
														>
															<input
																type="radio"
																name="application-status"
																id={`jbappli-status-${option.value}`}
																checked={filters.status === option.value}
																onChange={() =>
																	handleFilterChange({ status: option.value })
																}
															/>
															<label
																htmlFor={`jbappli-status-${option.value}`}
																className="mb-0"
															>
																{option.label}
															</label>
														</div>
													))}
												</div>
											</div>
										</div>
										<div className="zc-accordion-item">
											<div
												className={`zc-accordion-header ${isDateAccordionOpen ? "active" : ""}`}
												onClick={() =>
													setIsDateAccordionOpen(!isDateAccordionOpen)
												}
											>
												<h3>Applied Date</h3>
												<i className="fa-solid fa-angle-down"></i>
											</div>
											<div
												className="zc-accordion-content"
												style={{
													display: isDateAccordionOpen ? "block" : "none",
												}}
											>
												<div className="jappli-status-filter">
													<div className="zc-field">
														<label>After</label>
														<input
															type="date"
															className="zc-date-field border p-2 w-full"
															value={filters.after_date}
															onChange={(e) =>
																handleFilterChange({
																	after_date: e.target.value,
																})
															}
														/>
													</div>
													<div className="zc-field">
														<label>Before</label>
														<input
															type="date"
															className="zc-date-field border p-2 w-full"
															value={filters.before_date}
															onChange={(e) =>
																handleFilterChange({
																	before_date: e.target.value,
																})
															}
														/>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className="col-lg-8">
							<div className="zc-job-search-wrap zc-card mb-4">
								<div className="search-input-box">
									<i className="fa-solid fa-magnifying-glass"></i>
									<input
										type="text"
										placeholder="Search Jobs"
										value={filters.search}
										onChange={(e) =>
											handleFilterChange({ search: e.target.value })
										}
									/>
								</div>
								<div className="jobs-found">
									<p>
										Found {pagination.total} job
										{pagination.total !== 1 ? "s" : ""}
									</p>
								</div>
							</div>
							{loading ? (
								<div className="text-center py-5">Loading...</div>
							) : initialJobs.length === 0 ? (
								<div className="rounded-md bg-white py-5 text-center shadow-md">
									<p>No applications found</p>
								</div>
							) : (
								<div className="zc-applied-job-wrapper">
									<div className="zc-applied-jobs-grid mb-3">
										{initialJobs.map((job) => (
											<AppliedJobItem key={job.id} opening={job} />
										))}
									</div>
									{pagination.last_page > 1 && (
										<div className="pagination-wrapper flex justify-center mt-4">
											{Array.from(
												{ length: pagination.last_page },
												(_, i) => i + 1,
											).map((page) => (
												<button
													key={page}
													onClick={() => handlePageChange(page)}
													disabled={page === pagination.current_page}
													className={`px-3 py-1 mx-1 ${page === pagination.current_page ? "bg-blue-500 text-white" : "bg-gray-200"}`}
												>
													{page}
												</button>
											))}
										</div>
									)}
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</AppLayout>
	);
};

export default AppliedJobsListing;
