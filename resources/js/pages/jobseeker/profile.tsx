import { Head, usePage } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/layouts/jobseeker-layout';
import ProfileModal from '@/components/jobseeker/profile-modal';
import { Company, JobSeekerProfile, Skill, User } from '@/types';
import { format } from 'date-fns';
import SummaryModal from '@/components/jobseeker/summary-modal';
import SkillsModal from '@/components/jobseeker/skills-modal';
import EmploymentModel from '@/components/jobseeker/employment-modal';

type ModalName = 'profile' | 'summary' | 'experience' | 'skills' | 'employment' | null;

interface Props {
    user: User,
    jobseeker_profile: JobSeekerProfile,
    skills: Skill[],
    companies: Company[]
}

export default function Profile( { user, jobseeker_profile, skills, companies }: Props ) {
    const { auth } = usePage<{ auth: { user: User } }>().props;
    const { user: AuthUser } = auth;

    const isUpdatable = user.id === AuthUser.id;

    const [ activeModal, setActiveModal ] = useState<ModalName>( null );
    const [ employmentDefaultValues, setEmploymentDefaultValues ] = useState<any | undefined>( undefined );

    const openModal = ( modal: ModalName ) => setActiveModal( modal );
    const closeModal = () => {
        setActiveModal( null );
        setEmploymentDefaultValues( undefined );
    };

    return (
        <AppLayout>
            <Head title="Explore" />
            <div className="zc-candidate-profile-wrapper">
                <div className="zc-container">
                    <div className="zc-candidate-profile-header mb-3">
                        <div className="top-cover"></div>
                        <div className="candidate-basic-details d-block d-sm-flex">
                            <div className="candidate-image p-3">
                                <img src={ user.avatar_url } alt="Profile" />
                            </div>
                            <div className="candidate-info p-3">
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
                                                <h4 className="designation">{/* Optional: job title */ }</h4>
                                                <p className="company-name">at {/* Optional: company name */ }</p>
                                            </div>
                                            <div className="profile-updated-date">
                                                Profile last updated - <span className="date">{ jobseeker_profile?.updated_at && format( new Date( jobseeker_profile?.updated_at ), "dd MMM yyyy" ) }</span>
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
                                        <li><i className="fa-solid fa-briefcase"></i>{ jobseeker_profile?.experience }</li>
                                        <li><i className="fa-solid fa-calendar-days"></i>{ jobseeker_profile?.notice_period }</li>
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
                            { jobseeker_profile?.summary }
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
                                                <a onClick={ () => {
                                                    setEmploymentDefaultValues( workExperience );
                                                    openModal( 'employment' );
                                                } } className="zc-btn-edit">
                                                    <i className="fa-solid fa-pencil"></i>
                                                </a>
                                            ) }
                                        </div>
                                        <h4 className="company-name-location">
                                            { workExperience.name ?? workExperience.company?.name }, { workExperience.company?.address?.location.city ?? "" }, { workExperience.company?.address?.location.state ?? "" }, { workExperience.company?.address?.location.country ?? "" }
                                        </h4>
                                        <div className="duration">
                                            { format( new Date( workExperience.start_date ), "dd MMM yyyy" ) } -{ " " }
                                            { workExperience.is_current || !workExperience.end_date
                                                ? "Present"
                                                : format( new Date( workExperience.end_date ), "dd MMM yyyy" ) }
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


                    <ProfileModal
                        defaultValues={ { user, jobseeker_profile } }
                        isActive={ activeModal === 'profile' }
                        handleClose={ closeModal }
                    />
                    <SummaryModal
                        defaultSummary={ jobseeker_profile?.summary }
                        isActive={ activeModal === 'summary' }
                        handleClose={ closeModal }
                    />
                    <SkillsModal
                        defaultValues={ { user, skills } }
                        isActive={ activeModal === 'skills' }
                        handleClose={ closeModal }
                    />
                    <EmploymentModel
                        defaultValues={ employmentDefaultValues }
                        isActive={ activeModal === 'employment' }
                        handleClose={ closeModal }
                        companies={ companies }
                    />
                </div>
            </div>
        </AppLayout>
    );
}