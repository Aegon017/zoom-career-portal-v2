import ProfileModal from '@/components/jobseeker/profile-modal';
import Certifications from '@/components/jobseeker/profile/certifications';
import Educations from '@/components/jobseeker/profile/educations';
import Employments from '@/components/jobseeker/profile/employments';
import Languages from '@/components/jobseeker/profile/languages';
import PersonalDetails from '@/components/jobseeker/profile/personal-details';
import SkillsModal from '@/components/jobseeker/skills-modal';
import SummaryModal from '@/components/jobseeker/summary-modal';
import { useInitials } from '@/hooks/use-initials';
import AppLayout from '@/layouts/jobseeker-layout';
import type { Company, Skill, User } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { format } from 'date-fns';
import { useState } from 'react';

type ModalName = 'profile' | 'summary' | 'experience' | 'skills' | 'employment' | 'personalDetails' | null;

interface Props {
    user: User;
    skills: Skill[];
    companies: Company[];
}

export default function Profile({ user }: Props) {
    const { auth } = usePage<{ auth: { user: User } }>().props;
    const { user: AuthUser } = auth;

    const isUpdatable = user.id == AuthUser.id;

    const [activeModal, setActiveModal] = useState<ModalName>(null);
    const [employmentDefaultValues, setEmploymentDefaultValues] = useState<any | undefined>(undefined);

    const openModal = (modal: ModalName) => setActiveModal(modal);
    const closeModal = () => {
        setActiveModal(null);
        setEmploymentDefaultValues(undefined);
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
                                {user.avatar_url ? (
                                    <img src={user.avatar_url} />
                                ) : (
                                    <div
                                        className="bg-secondary d-flex align-items-center justify-content-center rounded-circle fs-1 m-auto text-white"
                                        style={{ width: '160px', height: '160px' }}
                                    >
                                        {getInitials(user.name)}
                                    </div>
                                )}
                            </div>
                            <div className="candidate-info flex-fill p-3">
                                <div className="zc-row d-block d-md-flex justify-content-between bb-style-2 pb-3">
                                    <div className="left-col mb-md-0 mb-2">
                                        <div className="name">
                                            <h2>{user.name}</h2>
                                            {isUpdatable && (
                                                <a className="zc-btn-edit" onClick={() => openModal('profile')}>
                                                    <i className="fa-solid fa-pencil"></i>
                                                </a>
                                            )}
                                        </div>
                                        <div className="d-block">
                                            {user.profile?.job_title && (
                                                <div className="current-emp-info">
                                                    <h4 className="designation">{user.profile?.job_title}</h4>
                                                </div>
                                            )}
                                            {user.profile?.updated_at && (
                                                <div className="profile-updated-date">
                                                    Profile last updated -{' '}
                                                    <span className="date">
                                                        {user.profile?.updated_at && format(new Date(user.profile?.updated_at), 'dd MMM yyyy')}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="right-col follower-block d-flex align-items-start gap-2">
                                        <div className="icon-text">
                                            <a>
                                                <span>{user.followers.length}</span> followers
                                            </a>
                                        </div>
                                        <div className="icon-text">
                                            <a>
                                                <span>{(user.followingUsers?.length ?? 0) + (user.followingCompanies?.length ?? 0)}</span> following
                                            </a>
                                        </div>
                                    </div>
                                </div>
                                <div className="other-details">
                                    <ul>
                                        <li>
                                            <i className="fa-solid fa-location-dot"></i>{' '}
                                            {user.address?.location
                                                ? `${user.address.location.city}, ${user.address.location.state}, ${user.address.location.country}`
                                                : 'N/A'}
                                        </li>
                                        <li>
                                            <i className="fa-solid fa-briefcase"></i> {user.profile?.experience ? user.profile.experience : 'N/A'}
                                        </li>
                                        <li>
                                            <i className="fa-solid fa-calendar-days"></i>{' '}
                                            {user.profile?.notice_period ? user.profile.notice_period : 'N/A'}
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="zc-profile-summary zc-card-style-2 mb-3">
                        <div className="zc-card-header d-flex align-items-center justify-content-between gap-2">
                            <h3 className="mb-0">Summary</h3>
                            {isUpdatable && (
                                <a onClick={() => openModal('summary')} className="zc-btn-edit">
                                    <i className="fa-solid fa-pencil"></i>
                                </a>
                            )}
                        </div>
                        <div className="zc-card-content">{user.profile?.summary ?? 'No summary added yet.'}</div>
                    </div>

                    <div className="zc-profile-skills zc-card-style-2 mb-3">
                        <div className="zc-card-header d-flex align-items-center justify-content-between gap-2">
                            <h3 className="mb-0">Skills</h3>
                            {isUpdatable && (
                                <a onClick={() => openModal('skills')} className="zc-btn-edit">
                                    <i className="fa-solid fa-pencil"></i>
                                </a>
                            )}
                        </div>
                        <div className="zc-card-content">
                            <ul className="zc-skills-list">
                                {user.skills && user.skills.length > 0 ? (
                                    user.skills.map((skill) => <li key={skill.id}>{skill.name}</li>)
                                ) : (
                                    <p>No skills added yet.</p>
                                )}
                            </ul>
                        </div>
                    </div>

                    <Employments isUpdatable={isUpdatable} user={user} />

                    <Educations isUpdatable={isUpdatable} user={user} />

                    <Certifications isUpdatable={isUpdatable} user={user} />

                    {/* Personal Details */}
                    <PersonalDetails isUpdatable={isUpdatable} user={user} />
                    <Languages isUpdatable={isUpdatable} user={user} />

                    <ProfileModal user={user} isActive={activeModal === 'profile'} handleClose={closeModal} />

                    <SummaryModal defaultSummary={user.profile?.summary} isActive={activeModal === 'summary'} handleClose={closeModal} />

                    <SkillsModal user={user} isActive={activeModal === 'skills'} handleClose={closeModal} />
                </div>
            </div>
        </AppLayout>
    );
}
