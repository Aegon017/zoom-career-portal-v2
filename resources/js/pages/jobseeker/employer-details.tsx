import FollowButton from '@/components/follow-button';
import OpeningItem from '@/components/jobseeker/opening-item';
import JobseekerLayout from '@/layouts/jobseeker-layout';
import { Company } from '@/types';
import { Head, Link } from '@inertiajs/react'

interface Props {
    company: Company
}

const EmployerDetails = ({ company }: Props) => {
    return (
        <JobseekerLayout>
            <Head title="Explore" />
            <div className="zc-main-wrapper py-4">
                <div className="zc-container">
                    <div className="back-btn-wrapper mb-3">
                        <Link href={route('jobseeker.employers.index')}><i className="fa-solid fa-arrow-left"></i>Go Back</Link>
                    </div>
                    <div className="zc-employer-profile-view-wrapper bg-white">
                        <div className="zc-employer-profile-view-top">
                            <div className="zc-employer-profile-cover">
                                <img src={company.banner} className="mw-100" />
                            </div>
                            <div className="zc-employer-profile-view-header d-block d-md-flex gap-3">
                                <div className="col-left mb-2 mb-md-0">
                                    <div className="employer-logo">
                                        <img src={company.company_logo} className="mw-100" />
                                    </div>
                                </div>
                                <div className="col-right">
                                    <div className="top">
                                        <div className="left">
                                            <h3 className="employer-name">{company.company_name}</h3>
                                            <h5 className="employer-industry">{company.industry}</h5>
                                        </div>
                                        <div className="right">
                                            <div className="btn-group">
                                                <FollowButton
                                                    followableId={company.id}
                                                    followableType="company"
                                                    isFollowing={company.is_followed}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bottom">
                                        <ul>
                                            <li><i className="fa-solid fa-location-dot"></i><span>{company.company_address}</span></li>
                                            <li><i className="fa-solid fa-user-tie"></i><span>{company.company_size}</span></li>
                                            <li><i className="fa-solid fa-globe"></i><span><a href={company.company_website} target="_blank">{company.company_website}</a></span></li>
                                            <li><i className="fa-solid fa-building"></i><span>{company.company_type}</span></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="zc-employer-profile-view-body d-block w-100 position-relative p-5">
                            <div className="zc-employer-overview mb-3 zc-block">
                                <div className="title-block">
                                    <h3 className="mb-2">Overview</h3>
                                </div>
                                <div className="content-block">
                                    <p>{company.company_description}</p>
                                </div>
                            </div>
                            <div className="zc-employer-jobs zc-block">
                                <div className="title-block">
                                    <h3 className="mb-3">Jobs</h3>
                                </div>
                                <div className="content-block">
                                    <div className="row zc-employer-job-list">
                                        {company.openings.map((opening, index) => (
                                            <div className="col-lg-6 col-md-6 col-sm-12 mb-3">
                                                <OpeningItem key={index} opening={opening} />
                                            </div>

                                        ))}

                                    </div>
                                    <div className="btn-block d-flex justify-content-center mt-2">
                                        <a href="#">View All</a>
                                    </div>
                                </div>
                            </div>
                            <div className="zc-employer-employee zc-block">
                                <div className="title-block">
                                    <h3 className="mb-3">People</h3>
                                </div>
                                <div className="content-block">
                                    <div className="row zc-employer-employee-list">
                                        {company.users.map((user) => (
                                            <div className="col-lg-6 col-md-6 col-sm-12 mb-3">
                                                <div className="zc-employee-item-grid">
                                                    <a href="#" className="btn-user-details"></a>
                                                    <div className="top">
                                                        <div className="profile-pic">
                                                            <img src={user.banner} />
                                                        </div>
                                                        <div className="employee-details">
                                                            <h3 className="employee-name">{user.name}</h3>
                                                            <p className="experience">
                                                                { }
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="bottom">
                                                        <ul>
                                                            <li>
                                                                <i className="fa-solid fa-briefcase"></i>
                                                                <span>{ }</span>
                                                            </li>
                                                            <li>
                                                                <i className="fa-solid fa-envelope"></i>
                                                                <span><a href={user.email}>{user.email}</a></span>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="btn-block d-flex justify-content-center mt-2">
                                        <a href="#">View All</a>
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

export default EmployerDetails