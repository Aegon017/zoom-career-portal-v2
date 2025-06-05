import { Link } from "@inertiajs/react";
import { formatDistanceToNow } from "date-fns";
import BookmarkButton from "./bookmark-button";
import { Opening } from "@/types";

const OpeningItem = ({ opening }: { opening: Opening }) => {
    return (
        <div className="zc-job-item-grid mb-3">
            <Link href={route('jobseeker.jobs.show', opening.id)} className="btn-job--details"></Link>
            <div className="zc-job-item-top">
                <div className="zc-job-item-company">
                    <div className="company-logo">
                        <img src={opening.company.company_logo} alt="Company Logo" />
                    </div>
                    <div className="company-info">
                        <h4>{opening.company.company_name}</h4>
                        <h5>{opening.company.company_type}</h5>
                    </div>
                </div>
                <div className="bookmark-job">
                    <BookmarkButton jobId={opening.id} isSaved={opening.is_saved} hasText={false} />
                </div>
            </div>
            <div className="zc-job-item-info">
                <h4 className="job-title">{opening.title}</h4>
                <ul className="job-info">
                    <li>
                        <i className="fa-solid fa-briefcase"></i>
                        {opening.employment_type}
                    </li>
                    <li>
                        <i className="fa-solid fa-location-dot"></i>
                        {opening.city}, {opening.country}
                    </li>
                    <li>
                        <i className="fa-solid fa-clock"></i>
                        {formatDistanceToNow(new Date(opening.published_at), { addSuffix: true })}
                    </li>
                    <li>
                        <i className="fa-solid fa-money-bill"></i>
                        {opening.salary_min} - {opening.salary_max} {opening.currency}
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default OpeningItem