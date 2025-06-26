import OpeningItem from "@/components/jobseeker/opening-item"
import AppLayout from "@/layouts/jobseeker-layout"
import { Opening } from "@/types"
import { Head, router } from "@inertiajs/react"
import { useState } from "react";

interface Props {
    jobs: Opening[];
    count: number;
}

const SavedJobsListing = ({ jobs: initialJobs, count: initialCount }: Props) => {
    const [jobs, setJobs] = useState(initialJobs);
    const [count, setCount] = useState(initialCount);

    const handleLoadMore = () => {
        const newCount = count + 10;
        router.get("/jobseeker/jobs/your/saved", { count: newCount }, {
            preserveState: true,
            preserveScroll: true,
        });
    };
    return (
        <AppLayout>
            <Head title="Explore" />
            <div className="zc-container">
                <div className="page-title px-4">
                    <h2 className="mt-0">Saved Jobs</h2>
                </div>
                <div className="zc-saved-jobs-wrapper zc-card">
                    <div className="zc-job-list">
                        {
                            jobs.map((job: Opening) => (
                                <OpeningItem key={job.id} opening={job} />
                            ))
                        }
                        <div className="load-more-wrapper text-center d-block position-relative">
                            <p id="jobsLeftText">10 More Jobs</p>
                            <button id="loadMoreBtn" onClick={handleLoadMore}>Load More</button>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}

export default SavedJobsListing