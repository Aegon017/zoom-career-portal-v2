import JobseekerLayout from '@/layouts/jobseeker-layout';
import { Company } from '@/types';
import { Head, Link } from "@inertiajs/react"
interface Props {
    companies: Company[]
}

const Employers = ({ companies }: Props) => {
    return (
        <JobseekerLayout>
            <Head title="Explore" />
            <div className="zc-main-wrapper py-4">
                <div className="zc-container">
                    <div className="page-title mb-3">
                        <h2>Employers</h2>
                        <p>Search and connect with Employer using Zoom’s advanced search.</p>
                    </div>
                    <div className="zc-employer-list-wrapper">
                        <div className="row">
                            <div className="col-lg-4 col-md-4 col-sm-12">
                                <div className="zc-search-wrapper d-block position-relative w-100 mb-3">
                                    <div className="field-wrap d-block w-100 position-relative">
                                        <input type="text" className="w-100" id="candidate-search" placeholder="Search by keyword" />
                                        <div className="icon"><i className="fa-solid fa-magnifying-glass"></i></div>
                                    </div>
                                </div>
                                <div className="zc-filter-wrapper mb-3 mb-lg-0">
                                    <div className="filter-header">
                                        <svg width="25px" height="25px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M4 5L10 5M10 5C10 6.10457 10.8954 7 12 7C13.1046 7 14 6.10457 14 5M10 5C10 3.89543 10.8954 3 12 3C13.1046 3 14 3.89543 14 5M14 5L20 5M4 12H16M16 12C16 13.1046 16.8954 14 18 14C19.1046 14 20 13.1046 20 12C20 10.8954 19.1046 10 18 10C16.8954 10 16 10.8954 16 12ZM8 19H20M8 19C8 17.8954 7.10457 17 6 17C4.89543 17 4 17.8954 4 19C4 20.1046 4.89543 21 6 21C7.10457 21 8 20.1046 8 19Z" stroke="#000000" stroke-width="1.5" stroke-linecap="round"></path>
                                        </svg>
                                        <span className="text">Filters</span>
                                    </div>
                                    <div className="filter-content">
                                        <div className="zc-filter-accordion">
                                            <div className="zc-accordion-item">
                                                <div className="zc-accordion-header active">
                                                    <h3>Activity</h3>
                                                    <i className="fa-solid fa-angle-down"></i>
                                                </div>
                                                <div className="zc-accordion-content">
                                                    <div className="student-type-filter">
                                                        <div className="zc-field check-box-field">
                                                            <input type="checkbox" name="student-type-alumni" id="jbappli-type-alumni" />
                                                            <label htmlFor="jbappli-type-alumni">Employers You Follow</label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="zc-accordion-item">
                                                <div className="zc-accordion-header active">
                                                    <h3>Industry</h3>
                                                    <i className="fa-solid fa-angle-down"></i>
                                                </div>
                                                <div className="zc-accordion-content">
                                                    <div className="zc-filter-search-dropdown position-relative">
                                                        <div className="selected-items">
                                                        </div>
                                                        <div className="search-field d-block w-100 position-relative">
                                                            <input type="text" name="search" id="industry-search" placeholder="Search Industry" autoComplete="off" />
                                                            <i className="fa-solid fa-magnifying-glass"></i>
                                                        </div>
                                                        <div className="filter-dropdown-wrapper">
                                                            <ul className="search-list" id="industry-list">

                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="zc-accordion-item">
                                                <div className="zc-accordion-header active">
                                                    <h3>Location</h3>
                                                    <i className="fa-solid fa-angle-down"></i>
                                                </div>
                                                <div className="zc-accordion-content">
                                                    <div className="zc-filter-search-dropdown position-relative">
                                                        <div className="selected-items">
                                                        </div>
                                                        <div className="search-field d-block w-100 position-relative">
                                                            <input type="text" name="search" id="location-search" placeholder="Search Location" autoComplete="off" />
                                                            <i className="fa-solid fa-magnifying-glass"></i>
                                                        </div>
                                                        <div className="filter-dropdown-wrapper">
                                                            <ul className="search-list" id="industry-list">
                                                                <li data-value="Mumbai">Mumbai</li>
                                                                <li data-value="Delhi">Delhi</li>
                                                                <li data-value="Banglore">Banglore</li>
                                                                <li data-value="Hyderabad">Hyderabad</li>
                                                                <li data-value="Pune">Pune</li>
                                                                <li data-value="Vijaywada">Vijaywada</li>
                                                                <li data-value="Chennai">Chennai</li>
                                                                <li data-value="Lucknow">Lucknow</li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="zc-accordion-item">
                                                <div className="zc-accordion-header active">
                                                    <h3>Employer Size</h3>
                                                    <i className="fa-solid fa-angle-down"></i>
                                                </div>
                                                <div className="zc-accordion-content">
                                                    <div className="zc-filter-search-dropdown position-relative">
                                                        <div className="selected-items">
                                                        </div>
                                                        <div className="search-field d-block w-100 position-relative">
                                                            <input type="text" name="search" id="employer-size-search" placeholder="Search Employer Size" autoComplete="off" />
                                                            <i className="fa-solid fa-magnifying-glass"></i>
                                                        </div>
                                                        <div className="filter-dropdown-wrapper">
                                                            <ul className="search-list" id="industry-list">
                                                                <li data-value="1 - 10">1 - 10</li>
                                                                <li data-value="10 - 50">10 - 50</li>
                                                                <li data-value="50 - 100">50 - 100</li>
                                                                <li data-value="100 - 250">100 - 250</li>
                                                                <li data-value="250 - 1,000">250 - 1,000</li>
                                                                <li data-value="1,000+">1,000+</li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-8 col-md-8 col-sm-12">
                                <div className="zc-employer-list d-block w-100 position-relative">
                                    {
                                        companies.map((company, index) => (
                                            <div className="zc-employer-list-item d-block w-100 position-relative">
                                                <Link href={route('jobseeker.employers.show', company.id)} className="details-link"></Link>
                                                <div className="top-sec">
                                                    <div className="left-block">
                                                        <div className="employer-logo">
                                                            <img src={company.company_logo} alt="" className="mw-100" />
                                                        </div>
                                                        <div className="employer-details">
                                                            <h3 className="employer-name">{company.company_name}</h3>
                                                            <p className="employer-industry">{company.industry}</p>
                                                        </div>
                                                    </div>
                                                    <div className="right-block">
                                                        <a href="#follow" className="btn-follow">
                                                            <i className="fas fa-user-plus"></i>
                                                            <span>Follow</span>
                                                        </a>
                                                    </div>
                                                </div>
                                                <div className="bottom-sec">
                                                    <ul className="zc-icon-list">
                                                        <li>
                                                            <i className="fa-solid fa-location-dot"></i>
                                                            <span>{company.company_address}</span>
                                                        </li>
                                                        <li>
                                                            <i className="fa-solid fa-user-tie"></i>
                                                            <span>
                                                                {company.company_size}
                                                            </span>
                                                        </li>
                                                        <li>
                                                            <i className="fa-solid fa-building"></i>
                                                            <span>{company.company_type}</span>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        ))
                                    }
                                    <div className="load-more-wrapper text-center d-block position-relative">
                                        <p id="jobsLeftText">10 More</p>
                                        <button id="loadMoreBtn">Load More</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </JobseekerLayout>
    )
}

export default Employers