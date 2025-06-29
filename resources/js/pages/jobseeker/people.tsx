import JobseekerLayout from '@/layouts/jobseeker-layout';
import { User } from '@/types';
import { Head, Link } from '@inertiajs/react';

interface Props {
    users: User[]
}

const People = ( { users }: Props ) => {
    return (
        <JobseekerLayout>
            <Head title="People" />
            <div className="zc-container">
                <div className="page-title mb-3">
                    <h2>Your Network Starts Here</h2>
                    <p>Search and connect with students and alumni using Zoom’s advanced search.</p>
                </div>
                <div className="zc-student-list-wrapper">
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
                                        <path d="M4 5L10 5M10 5C10 6.10457 10.8954 7 12 7C13.1046 7 14 6.10457 14 5M10 5C10 3.89543 10.8954 3 12 3C13.1046 3 14 3.89543 14 5M14 5L20 5M4 12H16M16 12C16 13.1046 16.8954 14 18 14C19.1046 14 20 13.1046 20 12C20 10.8954 19.1046 10 18 10C16.8954 10 16 10.8954 16 12ZM8 19H20M8 19C8 17.8954 7.10457 17 6 17C4.89543 17 4 17.8954 4 19C4 20.1046 4.89543 21 6 21C7.10457 21 8 20.1046 8 19Z" stroke="#000000" strokeWidth="1.5" strokeLinecap="round"></path>
                                    </svg>
                                    <span className="text">Filters</span>
                                </div>
                                <div className="filter-content">
                                    <div className="zc-filter-accordion">
                                        <div className="zc-accordion-item">
                                            <div className="zc-accordion-header active">
                                                <h3>Alumni</h3>
                                                <i className="fa-solid fa-angle-down"></i>
                                            </div>
                                            <div className="zc-accordion-content">
                                                <div className="student-type-filter">
                                                    <div className="zc-field check-box-field">
                                                        <input type="checkbox" name="student-type-alumni" id="jbappli-type-alumni" />
                                                        <label htmlFor="jbappli-type-alumni">Alumni</label>
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
                                                <h3>School</h3>
                                                <i className="fa-solid fa-angle-down"></i>
                                            </div>
                                            <div className="zc-accordion-content">
                                                <div className="zc-filter-search-dropdown position-relative">
                                                    <div className="selected-items">
                                                    </div>
                                                    <div className="search-field d-block w-100 position-relative">
                                                        <input type="text" name="search" id="industry-search" placeholder="Search Schools" autoComplete="off" />
                                                        <i className="fa-solid fa-magnifying-glass"></i>
                                                    </div>
                                                    <div className="filter-dropdown-wrapper">
                                                        <ul className="search-list" id="industry-list">
                                                            <li data-value="Marketing">Marketing</li>
                                                            <li data-value="Finance">Finance</li>
                                                            <li data-value="IT">IT</li>
                                                            <li data-value="Software">Software</li>
                                                            <li data-value="Mechanical">Mechanical</li>
                                                            <li data-value="Electronic">Electronic</li>
                                                            <li data-value="Real Estate">Real Estate</li>
                                                            <li data-value="Food">Food</li>
                                                            <li data-value="Government">Government</li>
                                                            <li data-value="Digital Marketing">Digital Marketing</li>
                                                            <li data-value="Sales">Sales</li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="zc-accordion-item">
                                            <div className="zc-accordion-header active">
                                                <h3>Skills</h3>
                                                <i className="fa-solid fa-angle-down"></i>
                                            </div>
                                            <div className="zc-accordion-content">
                                                <div className="zc-filter-search-dropdown position-relative">
                                                    <div className="selected-items">
                                                    </div>
                                                    <div className="search-field d-block w-100 position-relative">
                                                        <input type="text" name="search" id="industry-search" placeholder="Search Skills" autoComplete="off" />
                                                        <i className="fa-solid fa-magnifying-glass"></i>
                                                    </div>
                                                    <div className="filter-dropdown-wrapper">
                                                        <ul className="search-list" id="industry-list">
                                                            <li data-value="Marketing">Marketing</li>
                                                            <li data-value="Finance">Finance</li>
                                                            <li data-value="IT">IT</li>
                                                            <li data-value="Software">Software</li>
                                                            <li data-value="Mechanical">Mechanical</li>
                                                            <li data-value="Electronic">Electronic</li>
                                                            <li data-value="Real Estate">Real Estate</li>
                                                            <li data-value="Food">Food</li>
                                                            <li data-value="Government">Government</li>
                                                            <li data-value="Digital Marketing">Digital Marketing</li>
                                                            <li data-value="Sales">Sales</li>
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
                            <div className="zc-student-list">
                                {
                                    users.map( ( user, index ) => (
                                        <div key={ index } className="zc-student-list-item style-2">
                                            <div className="left">
                                                <img src={ user.profile_image } className="profile-img" />
                                            </div>
                                            <div className="right">
                                                <div className="top">
                                                    <h3 className="name">{ user.name }</h3>
                                                    <h5 className="current-job">{ }</h5>
                                                </div>
                                                <div className="middle">
                                                    {/* <div className="icon-text industry"><i className="fa-solid fa-industry"></i>{user.followingCompanies.}</div> */ }
                                                    { user.location && (
                                                        <div className="icon-text location"><i className="fa-solid fa-location-dot"></i>{ user.location }</div>
                                                    ) }
                                                </div>
                                                <div className="bottom">
                                                    <Link href={ `/jobseeker/profile/${ user.id }` } className="btn btn-details"><i className="fa-regular fa-user"></i> View Details</Link>
                                                    <a href="#" className="btn btn-msg"><i className="fa-regular fa-message"></i> Message</a>
                                                </div>
                                            </div>
                                        </div>
                                    ) )
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </JobseekerLayout >
    )
}

export default People