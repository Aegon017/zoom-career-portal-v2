import JobItem from '@/components/jobseeker/job-item'
import AppLayout from '@/layouts/jobseeker-layout'
import { JobPosting } from '@/types'
import { Head } from '@inertiajs/react'
import React from 'react'

const JobsListing = ({ jobs }: { jobs: JobPosting[] }) => {
    return (
        <>
            <AppLayout>
                <Head title="Explore" />
                <div className="page-title">
                    <h2>Jobs</h2>
                </div>
                <div className="zc-main-jobs-wrapper">
                    <div className="zc-container">
                        <div className="row">
                            <div className="col-lg-4">
                                <div className="zc-jobs-filter-wrapper zc-card">
                                    <div className="widget-header d-block mb-3">
                                        <div className="icon-text d-flex align-items-center gap-1">
                                            <svg width="25px" height="25px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M4 5L10 5M10 5C10 6.10457 10.8954 7 12 7C13.1046 7 14 6.10457 14 5M10 5C10 3.89543 10.8954 3 12 3C13.1046 3 14 3.89543 14 5M14 5L20 5M4 12H16M16 12C16 13.1046 16.8954 14 18 14C19.1046 14 20 13.1046 20 12C20 10.8954 19.1046 10 18 10C16.8954 10 16 10.8954 16 12ZM8 19H20M8 19C8 17.8954 7.10457 17 6 17C4.89543 17 4 17.8954 4 19C4 20.1046 4.89543 21 6 21C7.10457 21 8 20.1046 8 19Z" stroke="#000000" stroke-width="1.5" stroke-linecap="round"></path>
                                            </svg>
                                            Filter By
                                        </div>
                                    </div>
                                    <div className="zc-job-filter-widget d-block position-relative w-100">
                                        <div className="zc-field-wrap d-block position-relative mb-2">
                                            <label htmlFor="search_by_company">Company</label>
                                            <input type="text" name="search_by_company" id="search_by_company" />
                                        </div>
                                        <div className="zc-field-wrap d-block position-relative mb-2">
                                            <label htmlFor="search_by_jobtitle">Job Title</label>
                                            <input type="text" name="search_by_jobtitle" id="search_by_jobtitle" />
                                        </div>
                                        <div className="zc-field-wrap zc-dropdown-field d-block position-relative mb-2">
                                            <label htmlFor="search_by_emptype">Employement Type</label>
                                            <input type="text" name="search_by_emptype" id="search_by_emptype" className="dropdown-toggle" />
                                            <div className="zc-dropdown" id="employement_type">
                                                <div className="dropdown-options">
                                                    <label className="option"><input type="checkbox" value="Corporate" />Full Time</label>
                                                    <label className="option"><input type="checkbox" value="Startup" />Part Time</label>
                                                    <label className="option"><input type="checkbox" value="Non-Profit" />Non-Profit</label>
                                                    <label className="option"><input type="checkbox" value="Government" />Government</label>
                                                    <label className="option"><input type="checkbox" value="Freelance" />Freelance</label>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="zc-field-wrap zc-dropdown-field d-block position-relative mb-2">
                                            <label htmlFor="search_by_industry">Industry</label>
                                            <input type="text" name="search_by_industry" id="search_by_industry" className="dropdown-toggle" />
                                            <div className="zc-dropdown" id="industry_type">
                                                <input type="text" name="zc-dropdown-search" id="zc-dropdown-search" className="zc-dropdown-search" placeholder="Search" />
                                                <div className="dropdown-options">
                                                    <label className="option"><input type="checkbox" value="it" />IT</label>
                                                    <label className="option"><input type="checkbox" value="rel estate" />Real Estate</label>
                                                    <label className="option"><input type="checkbox" value="marketing" />Marketing</label>
                                                    <label className="option"><input type="checkbox" value="Government" />Government</label>
                                                    <label className="option"><input type="checkbox" value="Freelance" />Freelance</label>
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
                                        <input type="text" name="job_search_key" id="job_search_key" placeholder="Search Jobs" />
                                    </div>
                                    <div className="jobs-found">
                                        <p>Found 168 job opportunities</p>
                                    </div>
                                </div>
                                <div className="zc-job-list">
                                    {jobs.map((job) => (
                                        <div className="zc-job-item-grid mb-3" key={job.id}>
                                            <JobItem job={job} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </AppLayout>
        </>
    )
}

export default JobsListing