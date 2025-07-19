// Explore.tsx
import OpeningItem from '@/components/jobseeker/opening-item';
import JobseekerLayout from '@/layouts/jobseeker-layout';
import { Opening } from '@/types';
import { Head, Link } from '@inertiajs/react';

interface ExploreProps {
    openings: Opening[];
    interests: {
        categories: string[];
        locations: string[];
        viewMoreFilters: { // NEW: Added type for viewMoreFilters
            job_title: string;
            industries: number[];
        };
    };
}

const Explore = ( { openings, interests }: ExploreProps ) => {
    const categoriesDisplay = interests.categories.length
        ? interests.categories.join( ', ' )
        : 'Various Categories';

    const locationsDisplay = interests.locations.length
        ? interests.locations.join( ', ' )
        : 'Various Locations';

    // Generate query parameters for View More link using existing filters
    const query = new URLSearchParams();

    // Add job_title if it exists
    if ( interests.viewMoreFilters.job_title ) {
        query.append( 'job_title', interests.viewMoreFilters.job_title );
    }

    // Add industries
    interests.viewMoreFilters.industries.forEach( industryId => {
        query.append( 'industries[]', industryId.toString() );
    } );

    const queryString = query.toString();

    return (
        <JobseekerLayout>
            <Head title="Explore" />
            <div className="zc-jobs-by-interest-sec">
                <div className="zc-container">
                    <div className="page-title">
                        <h2>Explore</h2>
                    </div>

                    { openings.length > 0 ? (
                        <>
                            <div className="zc-jobs-by-interest-header mb-4">
                                <h4 className="title">
                                    Jobs For <span className="job-category">{ categoriesDisplay }</span> in{ ' ' }
                                    <span className="job-location">{ locationsDisplay }</span>
                                </h4>
                                <Link
                                    className="btn-more"
                                    href={ `/jobseeker/jobs?${ queryString }` }
                                >
                                    View More
                                </Link>
                            </div>
                            <div className="zc-jobs-by-interest-list">
                                <div className="row">
                                    { openings.map( ( opening ) => (
                                        <div className="col-lg-6 col-md-6 col-sm-12 mb-3" key={ opening.id }>
                                            <OpeningItem opening={ opening } />
                                        </div>
                                    ) ) }
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-5">
                            <p>No jobs found based on your career interests.</p>
                            <Link
                                href="/jobseeker/profile/career-interests"
                                className="btn btn-primary"
                            >
                                Update Career Interests
                            </Link>
                        </div>
                    ) }
                </div>
            </div>
        </JobseekerLayout>
    )
}

export default Explore;