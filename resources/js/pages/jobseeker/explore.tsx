import OpeningItem from '@/components/jobseeker/opening-item';
import JobseekerLayout from '@/layouts/jobseeker-layout';
import { Opening } from '@/types';
import { Head } from '@inertiajs/react';

interface ExploreProps {
    openings: Opening[];
    interests: {
        categories: string[];
        locations: string[];
    };
}

const Explore = ( { openings, interests }: ExploreProps ) => {
    const categoriesDisplay = interests.categories.length ? interests.categories.join( ', ' ) : 'Various Categories';
    const locationsDisplay = interests.locations.length ? interests.locations.join( ', ' ) : 'Various Locations';
    return (
        <JobseekerLayout>
            <Head title="Explore" />
            <div className="zc-jobs-by-interest-sec">
                <div className="zc-container">
                    <div className="page-title">
                        <h2>Explore</h2>
                    </div>
                    <div className="zc-jobs-by-interest-header mb-4">
                        <h4 className="title">
                            Jobs For <span className="job-category">{ categoriesDisplay }</span> in <span className="job-location">{ locationsDisplay }</span>
                        </h4>
                        <a href="#" className="btn-more">View More</a>
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
                    <div className="zc-jobs-by-interest-footer"></div>
                </div>
            </div>
        </JobseekerLayout>
    )
}

export default Explore;
