import AppLayout from '@/layouts/jobseeker-layout';
import { Head } from '@inertiajs/react';
import JobItem from '@/components/jobseeker/job-item';
import { JobPosting } from '@/types';

export default function Explore({ jobs }: { jobs: JobPosting[] }) {
    return (
        <AppLayout>
            <Head title="Explore" />
            <div className="page-title">
                <h2>Explore</h2>
            </div>
            <div className="zc-jobs-by-interest-sec">
                <div className="zc-container">
                    <div className="zc-jobs-by-interest-header mb-4">
                        <h4 className="title">Jobs For <span className="job-category">Marketing & Research</span> in <span className="job-location">Hyderabad</span></h4>
                        <a href="#" className="btn-more">View More</a>
                    </div>
                    <div className="zc-jobs-by-interest-list">
                        <div className="row">
                            {jobs.map((job) => (
                                <div className="col-lg-4 col-md-6 col-sm-12 mb-3" key={job.id}>
                                    <JobItem job={job} />
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="zc-jobs-by-interest-footer"></div>
                </div>
            </div>
        </AppLayout>
    );
}
