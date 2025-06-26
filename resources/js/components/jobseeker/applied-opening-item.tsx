import { Opening } from '@/types'
import { Link } from '@inertiajs/react'
import { formatDistanceToNow } from 'date-fns'

const AppliedJobItem = ({ opening }: { opening: Opening }) => {
    return (
        <div className="zc-applied-job-item">
            <div className="top">
                <div className="first-block mb-2">
                    <h3 className="job-title">{opening.title}</h3>
                    <div className="company-info">
                        <h5 className="mb-0">{opening.company.company_name}</h5>
                        <p className="mb-0">{opening.city}, {opening.country}</p>
                    </div>
                </div>
                <div className="second-block">
                    <div className="job-application-status mb-1">{opening.application_status}</div>
                    <p className="applied-date mb-0">Applied: {formatDistanceToNow(new Date(opening.application_created_at))}</p>
                </div>
            </div>
            <div className="bottom">
                <div className="first-block mb-sm-2 mb-md-0">
                    <p className="mb-0 line-clamp-2" dangerouslySetInnerHTML={{ __html: opening.description }}></p>
                </div>
                <div className="second-block">
                    <Link href={`/jobseeker/jobs/${opening.id}`}>Read More</Link>
                </div>
            </div>
        </div>
    )
}

export default AppliedJobItem