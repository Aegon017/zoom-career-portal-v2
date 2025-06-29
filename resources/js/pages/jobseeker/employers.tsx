import FilterIcon from '@/icons/filter-icon';
import JobseekerLayout from '@/layouts/jobseeker-layout';
import { Company } from '@/types';
import { Head, Link } from "@inertiajs/react"
interface Props {
    companies: Company[]
}

const Employers = ( { companies }: Props ) => {
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
                                        <FilterIcon />
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
                                        companies.map( ( company, index ) => (
                                            <div key={ index } className="zc-employer-list-item d-block w-100 position-relative">
                                                <Link href={ `/jobseeker/employers/${ company.id }` } className="details-link"></Link>
                                                <div className="top-sec">
                                                    <div className="left-block">
                                                        <div className="employer-logo">
                                                            <img src={ company.logo_url } alt="" className="mw-100" />
                                                        </div>
                                                        <div className="employer-details">
                                                            <h3 className="employer-name">{ company.name }</h3>
                                                            <p className="employer-industry">{ company.industry.name }</p>
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
                                                            <span>{ company.address.location.city }, { company.address.location.state }, { company.address.location.country }</span>
                                                        </li>
                                                        <li>
                                                            <i className="fa-solid fa-user-tie"></i>
                                                            <span>
                                                                { company.size }
                                                            </span>
                                                        </li>
                                                        <li>
                                                            <i className="fa-solid fa-building"></i>
                                                            <span>{ company.type }</span>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        ) )
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