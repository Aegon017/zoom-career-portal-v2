import FollowButton from '@/components/follow-button';
import ApplyButton from '@/components/jobseeker/apply-button';
import BookmarkButton from '@/components/jobseeker/bookmark-button';
import OpeningItem from '@/components/jobseeker/opening-item';
import AppLayout from '@/layouts/jobseeker-layout';
import { Opening } from '@/types';
import { Head } from '@inertiajs/react';
import { format, formatDistanceToNow } from 'date-fns';
import { useState } from 'react';

const JobDetails = ( { job, similar_jobs }: { job: Opening; similar_jobs: Opening[] } ) => {
    const [ redirecting, setRedirecting ] = useState( false );

    const handleApply = () => {
        if ( !job.apply_link ) return;

        setRedirecting( true );
        setTimeout( () => {
            window.open( job.apply_link, '_blank', 'noopener,noreferrer' );
            setRedirecting( false );
        }, 1500 );
    };

    const renderApplyButton = ( fullWidth = false ) => {
        if ( job.apply_link ) {
            return (
                <button
                    type="button"
                    onClick={ handleApply }
                    className={ `zc-btn zc-btn-primary ${ fullWidth ? 'w-100' : '' }` }
                >
                    Apply Now
                </button>
            );
        }
        return (
            <ApplyButton
                jobId={ job.id }
                hasApplied={ job.has_applied }
                status={ job.application_status }
            />
        );
    };

    return (
        <AppLayout>
            <Head title="Job details" />
            <div className="zc-job-details-wrapper">
                <div className="zc-container">
                    <div className="zc-job-details zc-card mt-4">
                        {/* Top Job Header */ }
                        <div className="job-details-header d-block position-relative w-100 pb-3">
                            <div className="company-info">
                                <a href="#">
                                    <div className="logo mb-2">
                                        <img src={ job.company.logo_url } alt={ job.company.name } />
                                    </div>
                                    <div className="details mb-2">
                                        <h3>{ job.company.name }</h3>
                                        <h4>{ job.company.industry.name }</h4>
                                    </div>
                                </a>
                            </div>
                            <div className="job-info mb-3">
                                <h2 className="job-title">{ job.title }</h2>
                                <p className="pdate-adate-info">
                                    { formatDistanceToNow( new Date( job.published_at ), { addSuffix: true } ) }
                                    <span className="divider"> - </span>
                                    Apply By { format( new Date( job.expires_at ), 'd MMMM, yyyy' ) }
                                </p>
                            </div>
                            <div className="job-action">
                                <BookmarkButton jobId={ job.id } isSaved={ job.is_saved } hasText={ true } />
                                { renderApplyButton() }
                                <FollowButton
                                    followableId={ job.company.id }
                                    followableType="company"
                                    isFollowing={ job.company.is_followed }
                                />
                            </div>
                        </div>

                        {/* Job Content */ }
                        <div className="job-details-content-wrap">
                            {/* Salary Highlight */ }
                            <div className="job-basic-info d-block position-relative w-100 py-4">
                                <h3 className="block-title mb-4">At a Glance</h3>
                                <ul className="info">
                                    <li>
                                        <i className="fa-solid fa-briefcase"></i>
                                        { job.employment_type }
                                    </li>
                                    <li>
                                        <i className="fa-solid fa-location-dot"></i>
                                        { job.address.location.full_name }
                                    </li>
                                    <li>
                                        <i className="fa-solid fa-clock"></i>
                                        { formatDistanceToNow( new Date( job.published_at ), { addSuffix: true } ) }
                                    </li>
                                    <li>
                                        <i className="fa-solid fa-money-bill"></i>
                                        <span className="salary-highlight">
                                            { job.salary_min } - { job.salary_max } { job.currency }
                                        </span>
                                    </li>
                                </ul>
                            </div>

                            {/* Skills */ }
                            <div className="job-skills d-block position-relative w-100 py-4">
                                <h3 className="block-title mb-4">Skills Required</h3>
                                <ul className="skills-list">
                                    { job.skills.map( ( skill, index ) => (
                                        <li key={ index }>{ skill.name }</li>
                                    ) ) }
                                </ul>
                            </div>

                            {/* Description */ }
                            <div className="job-description d-block position-relative w-100 py-4">
                                <h3 className="block-title mb-4">Job Description</h3>
                                <div dangerouslySetInnerHTML={ { __html: job.description } } />
                            </div>

                            {/* Bottom Apply Button */ }
                            <div className="job-footer-actions d-block position-relative w-100 py-4 text-center">
                                <div className="d-grid gap-2 col-lg-6 mx-auto">
                                    { renderApplyButton( true ) }
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Similar Jobs */ }
                    { similar_jobs.length > 0 && (
                        <div className="zc-similar-jobs d-block position-relative w-100 py-4">
                            <h3 className="block-title mb-4">Similar Jobs</h3>
                            { similar_jobs.map( ( job, index ) => (
                                <OpeningItem key={ index } opening={ job } />
                            ) ) }
                        </div>
                    ) }
                </div>
            </div>

            {/* Redirect Modal */ }
            { redirecting && (
                <div className="modal show fade d-block" role="dialog">
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content rounded-3 border-0 shadow-lg">
                            <div className="modal-body bg-light p-5 text-center">
                                <div className="spinner-border text-primary mb-4" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                                <h5 className="modal-title fw-semibold text-dark mb-2">Redirecting...</h5>
                                <p className="text-secondary mb-0">
                                    You’re being redirected to the employer's website.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            ) }
        </AppLayout>
    );
};

export default JobDetails;