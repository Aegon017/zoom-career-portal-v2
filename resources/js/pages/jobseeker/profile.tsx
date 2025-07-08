import { Head, usePage } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/layouts/jobseeker-layout';
import type { Company, Profile, Skill, User } from '@/types';
import { format } from 'date-fns';
import { useInitials } from '@/hooks/use-initials';
import ProfileModal from '@/components/jobseeker/profile-modal';
import SummaryModal from '@/components/jobseeker/summary-modal';
import SkillsModal from '@/components/jobseeker/skills-modal';
import EmploymentModal from '@/components/jobseeker/employment-modal';

type ModalName = 'profile' | 'summary' | 'experience' | 'skills' | 'employment' | null;

interface Props {
    user: User,
    skills: Skill[],
    companies: Company[]
}

export default function Profile( { user }: Props ) {
    const { auth } = usePage<{ auth: { user: User } }>().props;
    const { user: AuthUser } = auth;

    const isUpdatable = user.id == AuthUser.id;

    const [ activeModal, setActiveModal ] = useState<ModalName>( null );
    const [ employmentDefaultValues, setEmploymentDefaultValues ] = useState<any | undefined>( undefined );

    const openModal = ( modal: ModalName ) => setActiveModal( modal );
    const closeModal = () => {
        setActiveModal( null );
        setEmploymentDefaultValues( undefined );
    };

    const getInitials = useInitials();

    return (
        <AppLayout>
            <Head title="Explore" />
            <div className="zc-candidate-profile-wrapper">
                <div className="zc-container">
                    <div className="zc-candidate-profile-header mb-3">
                        <div className="top-cover"></div>
                        <div className="candidate-basic-details d-block d-sm-flex">
                            <div className="candidate-image p-3">
                                { user.avatar_url ? (
                                    <img src={ user.avatar_url } />
                                ) : (
                                    <div
                                        className="bg-secondary text-white d-flex align-items-center justify-content-center rounded-circle fs-1"
                                        style={ { width: '160px', height: '160px' } }
                                    >
                                        { getInitials( user.name ) }
                                    </div>
                                ) }
                            </div>
                            <div className="candidate-info p-3 flex-fill">
                                <div className="zc-row d-block d-md-flex justify-content-between bb-style-2 pb-3">
                                    <div className="left-col mb-2 mb-md-0">
                                        <div className="name">
                                            <h2>{ user.name }</h2>
                                            { isUpdatable && (
                                                <a className="zc-btn-edit" onClick={ () => openModal( 'profile' ) }>
                                                    <i className="fa-solid fa-pencil"></i>
                                                </a>
                                            ) }
                                        </div>
                                        <div className="d-block">
                                            <div className="current-emp-info">
                                                <h4 className="designation">{ user.profile?.job_title }</h4>
                                            </div>
                                            <div className="profile-updated-date">
                                                Profile last updated - <span className="date">{ user.profile?.updated_at && format( new Date( user.profile?.updated_at ), "dd MMM yyyy" ) }</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="right-col follower-block d-flex align-items-start gap-2">
                                        <div className="icon-text">
                                            <a><span>{ user.followers.length }</span> followers</a>
                                        </div>
                                        <div className="icon-text">
                                            <a><span>{ ( user.followingUsers?.length ?? 0 ) + ( user.followingCompanies?.length ?? 0 ) }</span> following</a>
                                        </div>
                                    </div>
                                </div>
                                <div className="other-details">
                                    <ul>
                                        <li><i className="fa-solid fa-location-dot"></i>{ user.address?.location.city }, { user.address?.location.state }, { user.address?.location.country }</li>
                                        <li><i className="fa-solid fa-briefcase"></i>{ user.profile?.experience }</li>
                                        <li><i className="fa-solid fa-calendar-days"></i>{ user.profile?.notice_period }</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="zc-profile-summary zc-card-style-2 mb-3">
                        <div className="zc-card-header d-flex align-items-center justify-content-between gap-2">
                            <h3 className="mb-0">Summary</h3>
                            { isUpdatable && (
                                <a onClick={ () => openModal( 'summary' ) } className="zc-btn-edit">
                                    <i className="fa-solid fa-pencil"></i>
                                </a>
                            ) }
                        </div>
                        <div className="zc-card-content">
                            { user.profile?.summary }
                        </div>
                    </div>

                    <div className="zc-profile-skills zc-card-style-2 mb-3">
                        <div className="zc-card-header d-flex align-items-center justify-content-between gap-2">
                            <h3 className="mb-0">Skills</h3>
                            { isUpdatable && (
                                <a onClick={ () => openModal( 'skills' ) } className="zc-btn-edit">
                                    <i className="fa-solid fa-pencil"></i>
                                </a>
                            ) }
                        </div>
                        <div className="zc-card-content">
                            <ul className="zc-skills-list">
                                { user.skills?.map( ( skill ) => (
                                    <li key={ skill.id }>{ skill.name }</li>
                                ) ) }
                            </ul>
                        </div>
                    </div>

                    <div className="zc-profile-employment zc-card-style-2 mb-3">
                        <div className="zc-card-header d-flex align-items-center justify-content-between gap-2">
                            <h3 className="mb-0">Employment</h3>
                            { isUpdatable && (
                                <a onClick={ () => {
                                    setEmploymentDefaultValues( undefined );
                                    openModal( 'employment' );
                                } } className="zc-btn-add">
                                    <i className="fa-solid fa-plus"></i>
                                </a>
                            ) }
                        </div>
                        <div className="zc-card-content">
                            <div className="employment-list">
                                { user.work_experiences.map( ( workExperience, index ) => (
                                    <div key={ index } className="employment-list-item">
                                        <div className="icon-text">
                                            <h3 className="job-title">{ workExperience.title }</h3>
                                            { isUpdatable && (
                                                <a
                                                    onClick={ () => {
                                                        setEmploymentDefaultValues( workExperience );
                                                        openModal( 'employment' );
                                                    } }
                                                    className="zc-btn-edit"
                                                >
                                                    <i className="fa-solid fa-pencil"></i>
                                                </a>
                                            ) }
                                        </div>
                                        <h4 className="company-name-location">
                                            { workExperience.company_name ?? workExperience.company?.name }
                                            { workExperience.company?.address && (
                                                <>
                                                    { ", " }
                                                    { [
                                                        workExperience.company.address.location.city,
                                                        workExperience.company.address.location.state,
                                                        workExperience.company.address.location.country
                                                    ]
                                                        .filter( Boolean )
                                                        .join( ', ' ) }
                                                </>
                                            ) }
                                        </h4>
                                        <div className="duration">
                                            { format( new Date( workExperience.start_date ), 'dd MMM yyyy' ) } -{ ' ' }
                                            { workExperience.is_current || !workExperience.end_date
                                                ? 'Present'
                                                : format( new Date( workExperience.end_date ), 'dd MMM yyyy' ) }
                                        </div>
                                    </div>
                                ) ) }
                            </div>
                        </div>
                    </div>

                    <div className="zc-profile-education zc-card-style-2 mb-3">
                        <div className="zc-card-header d-flex align-items-center justify-content-between gap-2">
                            <h3 className="mb-0">Education</h3>
                            { isUpdatable && (
                                <a href="#" id="zc-add-candidate-education" className="zc-btn-add">
                                    <i className="fa-solid fa-plus"></i>
                                </a>
                            ) }
                        </div>
                        <div className="zc-card-content">
                            <div className="education-list">
                                <div className="education-list-item">
                                    <div className="icon-text">
                                        <h3 className="education-course-title">Master of Business Administration (MBA)</h3>
                                        { isUpdatable && (
                                            <a href="#" id="zc-edit-candidate-education" className="zc-btn-edit">
                                                <i className="fa-solid fa-pencil"></i>
                                            </a>
                                        ) }
                                    </div>
                                    <h4 className="education-university-college">Hyderabad University</h4>
                                    <div className="course-type-year d-flex align-items-center gap-1 mb-2">
                                        <span className="year">2025</span>
                                        <span className="divider"></span>
                                        <span className="course-type">Full Time</span>
                                    </div>
                                </div>
                                <div className="education-list-item">
                                    <div className="icon-text">
                                        <h3 className="education-course-title">Bachelor of Computer Applications</h3>
                                        { isUpdatable && (
                                            <a href="#" id="zc-edit-candidate-education" className="zc-btn-edit">
                                                <i className="fa-solid fa-pencil"></i>
                                            </a>
                                        ) }
                                    </div>
                                    <h4 className="education-university-college">Acme College of Information Technology - [ACIT], Hyderabad</h4>
                                    <div className="course-type-year d-flex align-items-center gap-1 mb-2">
                                        <span className="year">2023</span>
                                        <span className="divider"></span>
                                        <span className="course-type">Full Time</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="zc-profile-certification zc-card-style-2 mb-3">
                        <div className="zc-card-header d-flex align-items-center justify-content-between gap-2">
                            <div className="text">
                                <h3 className="mb-0">Certification</h3>
                                <p className="mb-0">Add details of certifications you have completed</p>
                            </div>
                            <a href="#" id="zc-add-candidate-certificate" className="zc-btn-add">
                                <i className="fa-solid fa-plus"></i>
                            </a>
                        </div>
                        <div className="zc-card-content">
                            <div className="certificate-list">
                                <div className="certificate-list-item d-flex align-items-start gap-2">
                                    <div className="icon">
                                        <svg fill="#000000" width="40" height="40" viewBox="0 0 36 36" version="1.1" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                            <path d="M32,6H4A2,2,0,0,0,2,8V28a2,2,0,0,0,2,2H19l.57-.7.93-1.14L20.41,28H4V8H32l0,8.56a8.41,8.41,0,0,1,2,1.81V8A2,2,0,0,0,32,6Z" className="clr-i-outline clr-i-outline-path-1"></path>
                                            <rect x="7" y="12" width="17" height="1.6" className="clr-i-outline clr-i-outline-path-2"></rect>
                                            <rect x="7" y="16" width="11" height="1.6" className="clr-i-outline clr-i-outline-path-3"></rect>
                                            <rect x="7" y="23" width="10" height="1.6" className="clr-i-outline clr-i-outline-path-4"></rect>
                                            <path d="M27.46,17.23a6.36,6.36,0,0,0-4.4,11l-1.94,2.37.9,3.61,3.66-4.46a6.26,6.26,0,0,0,3.55,0l3.66,4.46.9-3.61-1.94-2.37a6.36,6.36,0,0,0-4.4-11Zm0,10.68a4.31,4.31,0,1,1,4.37-4.31A4.35,4.35,0,0,1,27.46,27.91Z" className="clr-i-outline clr-i-outline-path-5"></path>
                                        </svg>
                                    </div>
                                    <div className="info">
                                        <div className="title d-flex gap-2 align-items-center">
                                            <h3 className="certificate-name m-0">Cybersecurity Fundamentals</h3>
                                            <a href="#" id="zc-edit-candidate-certificate" className="zc-btn-edit">
                                                <i className="fa-solid fa-pencil"></i>
                                            </a>
                                        </div>
                                        <div className="certificate-validity">
                                            Validity: Lifetime
                                        </div>
                                    </div>
                                </div>
                                <div className="certificate-list-item d-flex align-items-start gap-2">
                                    <div className="icon">
                                        <svg fill="#000000" width="40" height="40" viewBox="0 0 36 36" version="1.1" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                            <path d="M32,6H4A2,2,0,0,0,2,8V28a2,2,0,0,0,2,2H19l.57-.7.93-1.14L20.41,28H4V8H32l0,8.56a8.41,8.41,0,0,1,2,1.81V8A2,2,0,0,0,32,6Z" className="clr-i-outline clr-i-outline-path-1"></path>
                                            <rect x="7" y="12" width="17" height="1.6" className="clr-i-outline clr-i-outline-path-2"></rect>
                                            <rect x="7" y="16" width="11" height="1.6" className="clr-i-outline clr-i-outline-path-3"></rect>
                                            <rect x="7" y="23" width="10" height="1.6" className="clr-i-outline clr-i-outline-path-4"></rect>
                                            <path d="M27.46,17.23a6.36,6.36,0,0,0-4.4,11l-1.94,2.37.9,3.61,3.66-4.46a6.26,6.26,0,0,0,3.55,0l3.66,4.46.9-3.61-1.94-2.37a6.36,6.36,0,0,0-4.4-11Zm0,10.68a4.31,4.31,0,1,1,4.37-4.31A4.35,4.35,0,0,1,27.46,27.91Z" className="clr-i-outline clr-i-outline-path-5"></path>
                                        </svg>
                                    </div>
                                    <div className="info">
                                        <div className="title d-flex gap-2 align-items-center">
                                            <h3 className="certificate-name m-0">Cybersecurity Associate - SOC Analyst</h3>
                                            <a href="#" id="zc-edit-candidate-certificate" className="zc-btn-edit">
                                                <i className="fa-solid fa-pencil"></i>
                                            </a>
                                        </div>
                                        <div className="certificate-validity">
                                            Validity: not mentioned
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="zc-profile-personal-details zc-card-style-2 mb-3">
                        <div className="zc-card-header d-flex align-items-center justify-content-between gap-2">
                            <div className="text">
                                <h3 className="mb-0">Personal Details</h3>
                            </div>
                            <a href="#" id="zc-edit-candidate-pdetails" className="zc-btn-edit">
                                <i className="fa-solid fa-pencil"></i>
                            </a>
                        </div>
                        <div className="zc-card-content">
                            <div className="row candidate-personal-details">
                                <div className="col-lg-6 col-md-6 col-sm-12 mb-3">
                                    <div className="title">Gender</div>
                                    <div className="value">Female</div>
                                </div>
                                <div className="col-lg-6 col-md-6 col-sm-12 mb-3">
                                    <div className="title">Date Of Birth</div>
                                    <div className="value">16 Sep 2002</div>
                                </div>
                                <div className="col-lg-6 col-md-6 col-sm-12 mb-3">
                                    <div className="title">Address</div>
                                    <div className="value">Banjara Hills, Hyderabad - 500034, Telangana, India</div>
                                </div>
                                <div className="col-lg-6 col-md-6 col-sm-12 mb-3">
                                    <div className="title">Marital Status</div>
                                    <div className="value">Single/unmarried</div>
                                </div>
                                <div className="col-lg-6 col-md-6 col-sm-12 mb-3">
                                    <div className="title">Work Permit</div>
                                    <div className="value">India</div>
                                </div>
                                <div className="col-lg-6 col-md-6 col-sm-12 mb-3">
                                    <div className="title">Differently Abled</div>
                                    <div className="value">No</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="zc-profile-candidate-languages zc-card-style-2 mb-3">
                        <div className="zc-card-header d-flex align-items-center justify-content-between gap-2">
                            <div className="text">
                                <h3 className="mb-0">Languages</h3>
                            </div>
                            <a href="#" id="zc-edit-candidate-languages" className="zc-btn-edit">
                                <i className="fa-solid fa-pencil"></i>
                            </a>
                        </div>
                        <div className="zc-card-content">
                            <div className="language-list">
                                <div className="language-list-item">
                                    <div className="row top">
                                        <div className="col-6 mb-2">
                                            <div className="title">Language</div>
                                            <div className="content">English</div>
                                        </div>
                                        <div className="col-6 mb-2">
                                            <div className="title">Proficiency</div>
                                            <div className="content">Proficient</div>
                                        </div>
                                    </div>
                                    <div className="bottom">
                                        <ul>
                                            <li>
                                                <i className="fa-solid fa-check"></i>
                                                Read
                                            </li>
                                            <li>
                                                <i className="fa-solid fa-check"></i>
                                                Write
                                            </li>
                                            <li>
                                                <i className="fa-solid fa-check"></i>
                                                Speak
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="language-list-item">
                                    <div className="row top">
                                        <div className="col-6 mb-2">
                                            <div className="title">Language</div>
                                            <div className="content">Telugu</div>
                                        </div>
                                        <div className="col-6 mb-2">
                                            <div className="title">Proficiency</div>
                                            <div className="content">Proficient</div>
                                        </div>
                                    </div>
                                    <div className="bottom">
                                        <ul>
                                            <li>
                                                <i className="fa-solid fa-xmark"></i>
                                                Read
                                            </li>
                                            <li>
                                                <i className="fa-solid fa-xmark"></i>
                                                Write
                                            </li>
                                            <li>
                                                <i className="fa-solid fa-check"></i>
                                                Speak
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <ProfileModal
                        user={ user }
                        isActive={ activeModal === 'profile' }
                        handleClose={ closeModal }
                    />

                    <SummaryModal
                        defaultSummary={ user.profile?.summary }
                        isActive={ activeModal === 'summary' }
                        handleClose={ closeModal }
                    />

                    <SkillsModal
                        user={ user }
                        isActive={ activeModal === 'skills' }
                        handleClose={ closeModal }
                    />

                    <EmploymentModal
                        defaultValues={ employmentDefaultValues }
                        isActive={ activeModal === 'employment' }
                        handleClose={ closeModal }
                    />

                </div>
            </div>
        </AppLayout>
    );
}