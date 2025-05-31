import AppLayout from "@/layouts/jobseeker-layout"
import { JobPosting } from "@/types"
import { Head } from "@inertiajs/react"
import { format, formatDistanceToNow } from "date-fns"

const JobDetails = ({ job }: { job: JobPosting }) => {
    console.log(job);
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
                                        <img src="assets/images/logo.png" />
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
                                <button className="zc-btn zc-btn-primary zc-btn-outline zc-btn-icon"><i className="fa-regular fa-bookmark"></i>Save</button>
                                <button className="zc-btn zc-btn-primary">Apply</button>
                                <button className="zc-btn zc-btn-secondary">follow Employer</button>
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
                    {/* <div className="zc-similar-jobs d-block w-100 position-relative py-4">
                        <h3 className="block-title mb-4">Similar Jobs</h3>
                        <div className="zc-job-item-grid mb-3">
                            <a href="#" className="btn-job--details"></a>
                            <div className="zc-job-item-top">
                                <div className="zc-job-item-company">
                                    <div className="company-logo">
                                        <img src="assets/images/logo.png" />
                                    </div>
                                    <div className="company-info">
                                        <h4>Zoom Techologies</h4>
                                        <h5>Training & Development</h5>
                                    </div>
                                </div>
                                <div className="bookmark-job">
                                    <a href="#" className="jb-bookmark-btn" title="Save Markting Intern">
                                        <i className="fa-regular fa-bookmark"></i>
                                    </a>
                                </div>
                            </div>
                            <div className="zc-job-item-info">
                                <h4 className="job-title">Marketing Intern</h4>
                                <ul className="job-info">
                                    <li>
                                        <i className="fa-solid fa-briefcase"></i>
                                        Fulltime
                                    </li>
                                    <li>
                                        <i className="fa-solid fa-location-dot"></i>
                                        Hyderabad, India
                                    </li>
                                    <li>
                                        <i className="fa-solid fa-clock"></i>
                                        2 Days Ago
                                    </li>
                                    <li>
                                        <i className="fa-solid fa-money-bill"></i>
                                        $30-40K/yr
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="zc-job-item-grid mb-3">
                            <a href="#" className="btn-job--details"></a>
                            <div className="zc-job-item-top">
                                <div className="zc-job-item-company">
                                    <div className="company-logo">
                                        <img src="assets/images/logo.png" />
                                    </div>
                                    <div className="company-info">
                                        <h4>Zoom Techologies</h4>
                                        <h5>Training & Development</h5>
                                    </div>
                                </div>
                                <div className="bookmark-job">
                                    <a href="#" className="jb-bookmark-btn" title="Save Markting Intern">
                                        <i className="fa-regular fa-bookmark"></i>
                                    </a>
                                </div>
                            </div>
                            <div className="zc-job-item-info">
                                <h4 className="job-title">Marketing Intern</h4>
                                <ul className="job-info">
                                    <li>
                                        <i className="fa-solid fa-briefcase"></i>
                                        Fulltime
                                    </li>
                                    <li>
                                        <i className="fa-solid fa-location-dot"></i>
                                        Hyderabad, India
                                    </li>
                                    <li>
                                        <i className="fa-solid fa-clock"></i>
                                        2 Days Ago
                                    </li>
                                    <li>
                                        <i className="fa-solid fa-money-bill"></i>
                                        $30-40K/yr
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div> */}
                </div>
            </div>
        </AppLayout>
    )
}

export default JobDetails