import JobItem from "@/components/jobseeker/job-item"
import AppLayout from "@/layouts/jobseeker-layout"
import { JobPosting } from "@/types"
import { Head } from "@inertiajs/react"

const SavedJobsListing = ({ jobs }: { jobs: JobPosting[] }) => {
    return (
        <AppLayout>
            <Head title="Explore" />
            <div className="zc-container">
                <div className="page-title">
                    <h2 className="mt-0">Saved Jobs</h2>
                </div>
                <div className="zc-saved-jobs-wrapper zc-card">
                    <div className="zc-job-list">
                        {
                            jobs.map((job: JobPosting) => (
                                <JobItem key={job.id} job={job} />
                            ))
                        }
                        <div className="load-more-wrapper text-center d-block position-relative">
                            <p id="jobsLeftText">10 More Jobs</p>
                            <button id="loadMoreBtn">Load More</button>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}

export default SavedJobsListing