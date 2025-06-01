import { JobPosting } from "@/types";
import { Link } from "@inertiajs/react";
import { formatDistanceToNow } from "date-fns";
import BookmarkButton from "./bookmark-button";

const JobItem = ({ job }: { job: JobPosting }) => {
    return (
        <div className="zc-job-item-grid mb-3">
            <Link href={route('jobseeker.jobs.show', job.id)} className="btn-job--details"></Link>
            <div className="zc-job-item-top">
                <div className="zc-job-item-company">
                    <div className="company-logo">
                        <img src={job.company.company_logo} alt="Company Logo" />
                    </div>
                    <div className="company-info">
                        <h4>{job.company.company_name}</h4>
                        <h5>{job.company.company_type}</h5>
                    </div>
                </div>
                <div className="bookmark-job">
                    <BookmarkButton jobId={job.id} isSaved={job.is_saved} hasText={false} />
                </div>
            </div>
            <div className="zc-job-item-info">
                <h4 className="job-title">{job.title}</h4>
                <ul className="job-info">
                    <li>
                        <i className="fa-solid fa-briefcase"></i>
                        {job.employment_type}
                    </li>
                    <li>
                        <i className="fa-solid fa-location-dot"></i>
                        {job.city}, {job.country}
                    </li>
                    <li>
                        <i className="fa-solid fa-clock"></i>
                        {formatDistanceToNow(new Date(job.published_at), { addSuffix: true })}
                    </li>
                    <li>
                        <i className="fa-solid fa-money-bill"></i>
                        {job.salary_min} - {job.salary_max} {job.currency}
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default JobItem