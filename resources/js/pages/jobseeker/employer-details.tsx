import FollowButton from '@/components/follow-button';
import OpeningItem from '@/components/jobseeker/opening-item';
import JobseekerLayout from '@/layouts/jobseeker-layout';
import { Company } from '@/types';
import { Head, Link } from '@inertiajs/react'

interface Props {
    company: Company
}

const EmployerDetails = ( { company }: Props ) => {
    return (
        <JobseekerLayout>
            <Head title="Explore" />
            <div className="zc-main-wrapper py-4">
                <div className="zc-container">
                    <div className="back-btn-wrapper mb-3">
                        <Link href="/jobseeker/employers"><i className="fa-solid fa-arrow-left"></i>Go Back</Link>
                    </div>
                    <div className="zc-employer-profile-view-wrapper bg-white">
                        <div className="zc-employer-profile-view-top">
                            <div className="zc-employer-profile-cover">
                                <img src={ company.banner_url } className="mw-100" />
                            </div>
                            <div className="zc-employer-profile-view-header d-block d-md-flex gap-3">
                                <div className="col-left mb-2 mb-md-0">
                                    <div className="employer-logo">
                                        <img src={ company.logo_url } className="mw-100" />
                                    </div>
                                </div>
                                <div className="col-right">
                                    <div className="top">
                                        <div className="left">
                                            <h3 className="employer-name">{ company.name }</h3>
                                            <h5 className="employer-industry">{ company.industry.name }</h5>
                                        </div>
                                        <div className="right">
                                            <div className="btn-group">
                                                <FollowButton
                                                    followableId={ company.id }
                                                    followableType="company"
                                                    isFollowing={ company.is_followed }
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bottom">
                                        <ul>
                                            <li><i className="fa-solid fa-location-dot"></i><span>{ company.address.location.city }, { company.address.location.state }, { company.address.location.country }</span></li>
                                            <li><i className="fa-solid fa-user-tie"></i><span>{ company.size }</span></li>
                                            <li><i className="fa-solid fa-globe"></i><span><a href={ company.website_url } target="_blank">{ company.website_url }</a></span></li>
                                            <li><i className="fa-solid fa-building"></i><span>{ company.type }</span></li>
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
                                    <p>{ company.description }</p>
                                </div>
                            </div>
                            <div className="zc-employer-jobs zc-block">
                                <div className="title-block">
                                    <h3 className="mb-3">Jobs</h3>
                                </div>
                                <div className="content-block">
                                    <div className="row zc-employer-job-list">
                                        { company.openings.map( ( opening, index ) => (
                                            <div className="col-lg-6 col-md-6 col-sm-12 mb-3">
                                                <OpeningItem key={ index } opening={ opening } />
                                            </div>

                                        ) ) }

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
                                        { company.users.map( ( user ) => (
                                            <div className="col-lg-6 col-md-6 col-sm-12 mb-3">
                                                <div className="zc-employee-item-grid">
                                                    <a href="#" className="btn-user-details"></a>
                                                    <div className="top">
                                                        <div className="profile-pic">
                                                            <img src={ user.banner_url } />
                                                        </div>
                                                        <div className="employee-details">
                                                            <h3 className="employee-name">{ user.name }</h3>
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
                                                                <span><a href={ user.email }>{ user.email }</a></span>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        ) ) }
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