import AppliedJobItem from "@/components/jobseeker/applied-opening-item"
import AppLayout from "@/layouts/jobseeker-layout"
import { Opening } from "@/types"
import { Head, router } from "@inertiajs/react"
import { useState } from "react"

interface Props {
    jobs: Opening[];
    count: number;
}

const SavedJobsListing = ({ jobs: initialJobs, count: initialCount }: Props) => {
    const [jobs, setJobs] = useState(initialJobs);
    const [count, setCount] = useState(initialCount);
    const [isDateAccordionOpen, setIsDateAccordionOpen] = useState(false);
    const [isStatusAccordionOpen, setIsStatusAccordionOpen] = useState(false);
    const [isTypeAccordionOpen, setIsTypeAccordionOpen] = useState(false);

    const handleLoadMore = () => {
        const newCount = count + 10;
        router.get(route('jobseeker.jobs.applied.index'), { count: newCount }, {
            preserveState: true,
            preserveScroll: true,
        });
    };
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
                                    <svg width="25px" height="25px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M4 5L10 5M10 5C10 6.10457 10.8954 7 12 7C13.1046 7 14 6.10457 14 5M10 5C10 3.89543 10.8954 3 12 3C13.1046 3 14 3.89543 14 5M14 5L20 5M4 12H16M16 12C16 13.1046 16.8954 14 18 14C19.1046 14 20 13.1046 20 12C20 10.8954 19.1046 10 18 10C16.8954 10 16 10.8954 16 12ZM8 19H20M8 19C8 17.8954 7.10457 17 6 17C4.89543 17 4 17.8954 4 19C4 20.1046 4.89543 21 6 21C7.10457 21 8 20.1046 8 19Z" stroke="#000000" strokeWidth="1.5" strokeLinecap="round"></path>
                                    </svg>
                                    <span className="text">Filters</span>
                                </div>
                                <div className="filter-content">
                                    <div className="zc-filter-accordion">
                                        <div className="zc-accordion-item">
                                            <div className={`zc-accordion-header ${isTypeAccordionOpen ? 'active' : ''}`} onClick={() => setIsTypeAccordionOpen(!isTypeAccordionOpen)}>
                                                <h3>Application Type</h3>
                                                <i className="fa-solid fa-angle-down"></i>
                                            </div>
                                            <div className="zc-accordion-content" style={{ display: isTypeAccordionOpen ? 'block' : 'none' }}>
                                                <div className="jappli-type-filter">
                                                    <div className="zc-field check-box-field">
                                                        <input type="checkbox" name="jbappli-type-1" id="jbappli-type-1" />
                                                        <label htmlFor="jbappli-type-1">Job Applications</label>
                                                    </div>
                                                    <div className="zc-field check-box-field">
                                                        <input type="checkbox" name="jbappli-type-2" id="jbappli-type-2" />
                                                        <label htmlFor="jbappli-type-2">Applications to interview</label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="zc-accordion-item">
                                            <div className={`zc-accordion-header ${isStatusAccordionOpen ? 'active' : ''}`} onClick={() => setIsStatusAccordionOpen(!isStatusAccordionOpen)}>
                                                <h3>Status</h3>
                                                <i className="fa-solid fa-angle-down"></i>
                                            </div>
                                            <div className="zc-accordion-content" style={{ display: isStatusAccordionOpen ? 'block' : 'none' }}>
                                                <div className="jappli-status-filter">
                                                    <div className="zc-field check-box-field">
                                                        <input
                                                            type="checkbox"
                                                            name="jbappli-status-1"
                                                            id="jbappli-status-1"
                                                            onChange={(e) => {
                                                                const filtered = e.target.checked
                                                                    ? initialJobs.filter(job => job.application_status === 'pending')
                                                                    : initialJobs;
                                                                setJobs(filtered);
                                                            }}
                                                        />
                                                        <label htmlFor="jbappli-status-1">Pending</label>
                                                    </div>
                                                    <div className="zc-field check-box-field">
                                                        <input
                                                            type="checkbox"
                                                            name="jbappli-status-2"
                                                            id="jbappli-status-2"
                                                            onChange={(e) => {
                                                                const filtered = e.target.checked
                                                                    ? initialJobs.filter(job => job.application_status === 'reviewed')
                                                                    : initialJobs;
                                                                setJobs(filtered);
                                                            }}
                                                        />
                                                        <label htmlFor="jbappli-status-2">Reviewed</label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="zc-accordion-item">
                                            <div className={`zc-accordion-header ${isDateAccordionOpen ? 'active' : ''}`} onClick={() => setIsDateAccordionOpen(!isDateAccordionOpen)}>
                                                <h3>Applied Date</h3>
                                                <i className="fa-solid fa-angle-down"></i>
                                            </div>
                                            <div className="zc-accordion-content" style={{ display: isDateAccordionOpen ? 'block' : 'none' }}>
                                                <div className="jappli-status-filter">
                                                    <div className="zc-field">
                                                        <label>Before</label>
                                                        <div className="field-with-icon border">
                                                            <input
                                                                type="date"
                                                                name="jappli-bdate"
                                                                id="jappli-bdate"
                                                                className="zc-date-field"
                                                                placeholder="dd/mm/yyyy"
                                                                onChange={(e) => {
                                                                    const beforeDate = new Date(e.target.value);
                                                                    const filtered = initialJobs.filter(job => {
                                                                        const appliedDate = new Date(job.application_created_at);
                                                                        return appliedDate <= beforeDate;
                                                                    });
                                                                    setJobs(filtered);
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="zc-field">
                                                        <label>After</label>
                                                        <div className="field-with-icon border">
                                                            <input
                                                                type="date"
                                                                name="jappli-adate"
                                                                id="jappli-adate"
                                                                className="zc-date-field"
                                                                placeholder="dd/mm/yyyy"
                                                                onChange={(e) => {
                                                                    const afterDate = new Date(e.target.value);
                                                                    const filtered = initialJobs.filter(job => {
                                                                        const appliedDate = new Date(job.application_created_at);
                                                                        return appliedDate >= afterDate;
                                                                    });
                                                                    setJobs(filtered);
                                                                }}
                                                            />
                                                        </div>
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
                                        name="job_search_key"
                                        id="job_search_key"
                                        placeholder="Search Jobs"
                                        onChange={(e) => {
                                            const searchTerm = e.target.value.toLowerCase();
                                            const filteredJobs = initialJobs.filter(job =>
                                                job.title.toLowerCase().includes(searchTerm)
                                            );
                                            setJobs(filteredJobs);
                                        }}
                                    />
                                </div>
                                <div className="jobs-found">
                                    <p>Found {jobs.length} job</p>
                                </div>
                            </div>
                            <div className="zc-applied-job-wrapper">
                                <div className="zc-applied-jobs-grid mb-3">
                                    {
                                        jobs.map((job: Opening) => (
                                            <AppliedJobItem key={job.id} opening={job} />
                                        ))
                                    }
                                </div>
                                <div className="load-more-wrapper text-center d-block position-relative">
                                    <p id="jobsLeftText">10 More Jobs</p>
                                    <button id="loadMoreBtn" onClick={handleLoadMore}>Load More</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}

export default SavedJobsListing