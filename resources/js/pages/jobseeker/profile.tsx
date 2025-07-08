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
import PopupModal from '@/components/popup-modal';
import PersonalDetails from '@/components/jobseeker/profile/personal-details';
import Languages from '@/components/jobseeker/profile/languages';
import Certifications from '@/components/jobseeker/profile/certifications';
import Educations from '@/components/jobseeker/profile/educations';
import Employments from '@/components/jobseeker/profile/employments';

type ModalName = 'profile' | 'summary' | 'experience' | 'skills' | 'employment' | 'personalDetails' | null;

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
                                        className="bg-secondary m-auto text-white d-flex align-items-center justify-content-center rounded-circle fs-1"
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
                                            { user.profile?.job_title && (
                                                <div className="current-emp-info">
                                                    <h4 className="designation">{ user.profile?.job_title }</h4>
                                                </div>
                                            )
                                            }
                                            { user.profile?.updated_at && (
                                                <div className="profile-updated-date">
                                                    Profile last updated - <span className="date">{ user.profile?.updated_at && format( new Date( user.profile?.updated_at ), "dd MMM yyyy" ) }</span>
                                                </div>
                                            )
                                            }
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
                                        { user.address?.location && (
                                            <li><i className="fa-solid fa-location-dot"></i>{ user.address?.location.city }, { user.address?.location.state }, { user.address?.location.country }</li>

                                        )
                                        }
                                        { user.profile?.experience && (
                                            <li><i className="fa-solid fa-briefcase"></i>{ user.profile?.experience }</li>
                                        )
                                        }
                                        { user.profile?.notice_period && (
                                            <li><i className="fa-solid fa-calendar-days"></i>{ user.profile?.notice_period }</li>
                                        )
                                        }
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

                    <Employments isUpdatable={ isUpdatable } user={ user } />

                    <Educations isUpdatable={ isUpdatable } user={ user } />

                    <Certifications isUpdatable={ isUpdatable } user={ user } />

                    {/* Personal Details */ }
                    <PersonalDetails isUpdatable={ isUpdatable } user={ user } />
                    <Languages isUpdatable={ isUpdatable } user={ user } />

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