import JobFilters from '@/components/jobseeker/job-filter';
import OpeningItem from '@/components/jobseeker/opening-item';
import AppLayout from '@/layouts/jobseeker-layout';
import { Company, Location, Opening, Option } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { useCallback, useEffect, useState } from 'react';

type Props = {
    initialJobs: {
        data: Opening[];
        next_page_url: string | null;
    };
    employmentTypes: Option[];
    companies: Company[];
    industries: Array<{ id: number; name: string }>;
    locations: Location[];
    filters: {
        job_title?: string;
        employment_types?: string[];
        industries?: string[];
        selected_companies?: string[];
        locations?: string[];
    };
};

const AllJobs = ( { initialJobs, employmentTypes, industries, filters, companies, locations }: Props ) => {
    const { props } = usePage<Props>();
    const [ jobs, setJobs ] = useState<Opening[]>( initialJobs.data );
    const [ nextPageUrl, setNextPageUrl ] = useState<string | null>( initialJobs.next_page_url );
    const [ loading, setLoading ] = useState( false );

    useEffect( () => {
        setJobs( props.initialJobs.data );
        setNextPageUrl( props.initialJobs.next_page_url );
    }, [ props.initialJobs ] );

    const loadMore = useCallback( () => {
        if ( !nextPageUrl || loading ) return;

        setLoading( true );
        router.get(
            nextPageUrl,
            {},
            {
                preserveScroll: true,
                preserveState: true,
                only: [ 'initialJobs' ],
                onSuccess: ( page ) => {
                    const newJobs = page.props.initialJobs as {
                        data: Opening[];
                        next_page_url: string | null;
                    };
                    setJobs( ( prev ) => [ ...prev, ...newJobs.data ] );
                    setNextPageUrl( newJobs.next_page_url );
                    setLoading( false );
                },
                onError: () => setLoading( false ),
            }
        );
    }, [ nextPageUrl, loading ] );

    return (
        <AppLayout>
            <Head title="Jobs" />
            <div className="zc-main-jobs-wrapper">
                <div className="zc-container">
                    <div className="page-title px-4">
                        <h2>Jobs</h2>
                    </div>
                    <div className="row">
                        <div className="col-lg-4">
                            <JobFilters
                                filters={ filters }
                                employmentOptions={ employmentTypes }
                                industries={ industries }
                                companies={ companies }
                                locations={ locations }
                            />
                        </div>
                        <div className="col-lg-8">
                            <div className="zc-card">
                                { jobs.length === 0 ? (
                                    <div className="py-5 text-center">
                                        <p>No jobs found. Try adjusting your filters.</p>
                                    </div>
                                ) : (
                                    jobs.map( ( job ) => (
                                        <div key={ job.id } className="mb-3">
                                            <OpeningItem opening={ job } />
                                        </div>
                                    ) )
                                ) }
                            </div>
                            { nextPageUrl && jobs.length > 0 && (
                                <div className="load-more-wrapper mt-4 text-center">
                                    <button className="btn btn-primary" onClick={ loadMore } disabled={ loading }>
                                        { loading ? (
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        ) : null }
                                        { loading ? 'Loading...' : 'Load More' }
                                    </button>
                                </div>
                            ) }
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default AllJobs;