import { JobPosting } from '@/types'
import { Link } from '@inertiajs/react'
import { format, formatDistanceToNow } from 'date-fns'
import React from 'react'

const AppliedJobItem = ({ job }: { job: JobPosting }) => {
    return (
        <div className="zc-applied-job-item">
            <div className="top">
                <div className="first-block mb-2">
                    <h3 className="job-title">{job.title}</h3>
                    <div className="company-info">
                        <h5 className="mb-0">{job.company.company_name}</h5>
                        <p className="mb-0">{job.city}, {job.country}</p>
                    </div>
                </div>
                <div className="second-block">
                    <div className="job-application-status mb-1">{job.pivot.status}</div>
                    <p className="applied-date mb-0">Applied: {formatDistanceToNow(new Date(job.pivot.updated_at))}</p>
                </div>
            </div>
            <div className="bottom">
                <div className="first-block mb-sm-2 mb-md-0">
                    <p className="mb-0 line-clamp-2" dangerouslySetInnerHTML={{ __html: job.description }}></p>
                </div>
                <div className="second-block">
                    <Link href={route('jobseeker.jobs.show', job.id)}>Read More</Link>
                </div>
            </div>
        </div>
    )
}

export default AppliedJobItem