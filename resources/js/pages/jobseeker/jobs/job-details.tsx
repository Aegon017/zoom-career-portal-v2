import FollowButton from "@/components/follow-button"
import ApplyButton from "@/components/jobseeker/apply-button"
import BookmarkButton from "@/components/jobseeker/bookmark-button"
import OpeningItem from "@/components/jobseeker/opening-item"
import AppLayout from "@/layouts/jobseeker-layout"
import { Opening } from "@/types"
import { Head } from "@inertiajs/react"
import { format, formatDistanceToNow } from "date-fns"

const JobDetails = ({ job, similar_jobs }: { job: Opening, similar_jobs: Opening[] }) => {
    return (
        <AppLayout>
            <Head title="Job details" />
            <div className="zc-job-details-wrapper">
                <div className="zc-container">
                    <div className="zc-job-details zc-card mt-4">
                        <div className="job-details-header d-block position-relative pb-3 w-100">
                            <div className="company-info">
                                <a href="#">
                                    <div className="logo mb-2">
                                        <img src={job.company.company_logo} />
                                    </div>
                                    <div className="details mb-2">
                                        <h3>{job.company.company_name}</h3>
                                        <h4>{job.company.industry}</h4>
                                    </div>
                                </a>
                            </div>
                            <div className="job-info mb-3">
                                <h2 className="job-title">{job.title}</h2>
                                <p className="pdate-adate-info">
                                    {formatDistanceToNow(new Date(job.published_at), { addSuffix: true })} <span className="divider">-</span> Apply By  {format(new Date(job.expires_at), 'd MMMM, yyyy')}
                                </p>
                            </div>
                            <div className="job-action">
                                <BookmarkButton jobId={job.id} isSaved={job.is_saved} hasText={true} />
                                <ApplyButton jobId={job.id} hasApplied={job.has_applied} status={job.application_status} />
                                <FollowButton
                                    followableId={job.company.id}
                                    followableType="company"
                                    isFollowing={job.company.is_followed}
                                />
                            </div>
                        </div>
                        <div className="job-details-content-wrap">
                            <div className="job-basic-info d-block w-100 position-relative py-4">
                                <h3 className="block-title mb-4">At a Glance</h3>
                                <ul className="info">
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
                            <div className="job-skills d-block w-100 position-relative py-4">
                                <h3 className="block-title mb-4">Skills Required</h3>
                                <ul className="skills-list">{
                                    job.skills.map((skill, index) => (
                                        <li key={index}>{skill.name}</li>
                                    ))}
                                </ul>
                            </div>
                            <div className="job-description d-block w-100 position-relative py-4">
                                <h3 className="block-title mb-4">Job Description</h3>
                                <div dangerouslySetInnerHTML={{ __html: job.description }} />
                            </div>
                        </div>
                    </div>
                    {similar_jobs.length > 0 && (
                        <div className="zc-similar-jobs d-block w-100 position-relative py-4">
                            <h3 className="block-title mb-4">Similar Jobs</h3>
                            {similar_jobs.map((job, index) => (
                                <OpeningItem key={index} opening={job} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    )
}

export default JobDetails